import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight options
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Get environment variables
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL");
    const senderEmail = Deno.env.get("SENDER_EMAIL") || notifyEmail; // Fallback to notifyEmail if not defined

    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY environment variable is not set inside Supabase Edge Secrets.");
    }
    if (!notifyEmail) {
      throw new Error("NOTIFY_EMAIL environment variable (your target inbox) is not set inside Supabase Edge Secrets.");
    }

    // 2. Parse the database webhook payload from Supabase
    // Webhook inserts send: { type: 'INSERT', table: 'contact_messages', record: { ... } }
    const payload = await req.json();
    const { record, type } = payload;

    // Only process INSERT events
    if (type !== "INSERT") {
      return new Response(JSON.stringify({ message: "Bypassed: Not an INSERT event" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!record) {
      throw new Error("Invalid webhook payload: 'record' object is missing.");
    }

    const { name, email, phone, subject, message, created_at } = record;

    // 3. Format the Email HTML body
    const emailSubject = `📩 Majdoor Mitra: New Message from ${name}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px; background-color: #f4f7f6; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
          .header { border-bottom: 2px solid #ea580c; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: bold; color: #ea580c; text-decoration: none; }
          .title { font-size: 18px; color: #475569; margin-top: 10px; margin-bottom: 0; }
          .meta-item { margin-bottom: 12px; font-size: 14px; }
          .meta-label { font-weight: bold; color: #64748b; display: inline-block; width: 120px; }
          .meta-value { color: #1e293b; }
          .message-box { background: #f8fafc; border-left: 4px solid #cbd5e1; padding: 15px 20px; margin-top: 20px; border-radius: 0 8px 8px 0; font-style: italic; color: #334155; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Majdoor Mitra 👷🏽</div>
            <h1 class="title">New Contact Form Submission</h1>
          </div>
          
          <div class="meta-item">
            <span class="meta-label">Sender Name:</span>
            <span class="meta-value">${name || 'Anonymous'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Email Address:</span>
            <span class="meta-value">${email || 'Not Provided'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Phone Number:</span>
            <span class="meta-value">${phone || 'Not Provided'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Subject:</span>
            <span class="meta-value">${subject || '(No Subject)'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Submitted At:</span>
            <span class="meta-value">${created_at ? new Date(created_at).toLocaleString() : new Date().toLocaleString()}</span>
          </div>

          <h3 style="margin-top: 25px; margin-bottom: 10px; color: #475569;">Message:</h3>
          <div class="message-box">
            ${message ? message.replace(/\n/g, '<br/>') : 'Empty message body.'}
          </div>

          <div class="footer">
            This is an automated notification from your Majdoor Mitra Supabase database webhook system.
          </div>
        </div>
      </body>
      </html>
    `;

    // 4. Request payload for Brevo API v3 Transactional Email
    const brevoPayload = {
      sender: {
        name: "Majdoor Mitra Alerts",
        email: senderEmail,
      },
      to: [
        {
          email: notifyEmail,
          name: "Administrator",
        },
      ],
      subject: emailSubject,
      htmlContent: emailHtml,
    };

    // 5. Fire request to Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "content-type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify(brevoPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(responseData)}`);
    }

    return new Response(JSON.stringify({ success: true, messageId: responseData.messageId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Webhook notification error:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
