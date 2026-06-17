import emailjs from "@emailjs/browser";

// --- EmailJS Configuration ---
const SERVICE_ID = "service_5yh8ram";
const DONOR_TEMPLATE_ID = "template_swf47fr";
const VOLUNTEER_TEMPLATE_ID = "template_1ihqjib";
const PUBLIC_KEY = "arIRZSuM35WWmRtYW";

// --- Admin Configuration ---
// Update this email address to the client's official email when ready
const VOLUNTEER_ADMIN_EMAIL = "rutuchougule07@gmail.com";
const DONOR_ADMIN_EMAIL = "rutuchougule07@gmail.com";

export const sendThankYouEmail = async (data: {
  to_name: string;
  to_email: string;
  amount: number;
  phone?: string;
  lang?: string;
  aadhaar?: string;
  pan?: string;
}) => {
  try {
    const isMr = data.lang === "mr";
    let receiptUrl = `${window.location.origin}/receipt?n=${encodeURIComponent(data.to_name)}&a=${data.amount}`;
    if (data.pan) receiptUrl += `&p=${encodeURIComponent(data.pan)}`;
    if (data.aadhaar) receiptUrl += `&ad=${encodeURIComponent(data.aadhaar)}`;

    const subject = isMr
      ? `तुमच्या देणगीबद्दल धन्यवाद, ${data.to_name}!`
      : `Thank you for your donation, ${data.to_name}!`;

    const response = await emailjs.send(
      SERVICE_ID,
      DONOR_TEMPLATE_ID,
      {
        to_name: data.to_name,
        to_email: data.to_email,
        amount: data.amount,
        receipt_url: receiptUrl,
        message_subject: subject,
      },
      PUBLIC_KEY
    );
    console.log("DONOR EMAIL SUCCESS!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("DONOR EMAIL FAILED...", error);
    throw error;
  }
};

export const sendVolunteerEmail = async (data: {
  to_name: string;
  to_email: string;
  lang?: string;
}) => {
  try {
    // Default to English unless specifically set to Marathi
    const isMarathi = data.lang === "mr";
    console.log("DEBUG: Sending Volunteer Email. Lang:", data.lang, "isMarathi:", isMarathi);

    const subject = isMarathi
      ? `संघात आपले स्वागत आहे, ${data.to_name}!`
      : `Welcome to the team, ${data.to_name}!`;

    const message = isMarathi
      ? `सस्नेह नमस्कार ${data.to_name}!\n\nभगिनी निवेदिता प्रतिष्ठानमध्ये स्वयंसेवक म्हणून काम करण्यासाठी तुमचा अर्ज आम्हाला प्राप्त झाला आहे. आमच्या संघात तुमचे मनःपूर्वक स्वागत!\n\nतुम्ही आमच्या कार्यात कशी मदत करू शकता यावर चर्चा करण्यासाठी आमचे समन्वयक लवकरच तुमच्याशी संपर्क साधतील. अधिक माहितीसाठी कृपया भगिनी निवेदिता प्रतिष्ठानशी थेट संपर्क साधा.\n\nधन्यवाद,\nभगिनी निवेदिता प्रतिष्ठान`
      : `Dear ${data.to_name},\n\nWe have received your application to volunteer with Bhagini Nivedita Pratishthan. A warm welcome to our team!\n\nOur coordinator will contact you soon to discuss how you can contribute to our activities. For more information, please feel free to contact Bhagini Nivedita Pratishthan directly.\n\nThank you,\nBhagini Nivedita Pratishthan`;

    const response = await emailjs.send(
      SERVICE_ID,
      VOLUNTEER_TEMPLATE_ID,
      {
        name: data.to_name,
        email: data.to_email,
        message_subject: subject,
        message: message,
        email_message: message,
      },
      PUBLIC_KEY
    );
    console.log("VOLUNTEER EMAIL SUCCESS!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("VOLUNTEER EMAIL FAILED...", error);
    throw error;
  }
};

export const sendAdminAlertEmail = async (data: {
  v_name: string;
  v_email: string;
  v_phone: string;
  v_skill: string;
  lang?: string;
}) => {
  try {
    const isMarathi = data.lang === "mr";

    const subject = isMarathi
      ? `नवीन स्वयंसेवक: ${data.v_name}`
      : `New Volunteer: ${data.v_name}`;

    const welcomeUrl = `mailto:${data.v_email}?subject=${encodeURIComponent(isMarathi ? `भगिनी निवेदिता प्रतिष्ठानमध्ये आपले स्वागत आहे - ${data.v_name}` : `Welcome to Bhagini Nivedita Pratishthan - ${data.v_name}`)}&body=${encodeURIComponent(isMarathi ? `सस्नेह नमस्कार ${data.v_name},\n\nतुम्ही स्वयंसेवक म्हणून आमच्यासोबत जोडले जात आहात, याचा आम्हाला अत्यंत आनंद होत आहे! आम्हाला तुमचा अर्ज प्राप्त झाला असून, '${data.v_skill}' मध्ये मदत करण्याच्या तुमच्या इच्छेचे आम्ही स्वागत करतो.\n\nपुढील प्रक्रियेबाबत चर्चा करण्यासाठी आमची टीम लवकरच तुमच्याशी संपर्क साधेल.\n\nआपले नम्र,\nभगिनी निवेदिता प्रतिष्ठान` : `Dear ${data.v_name},\n\nWe are very happy to have you join us as a volunteer! We have received your application and welcome your interest in helping with '${data.v_skill}'.\n\nOur team will contact you soon to discuss the next steps.\n\nSincerely,\nBhagini Nivedita Pratishthan`)}`;

    const welcomeHtmlText = isMarathi ? "स्वयंसेवकाला 'वेलकम' ईमेल पाठवण्यासाठी येथे क्लिक करा" : "Click here to send a Welcome email to this volunteer";
    const welcomeHtml = `<br><br><a href="${welcomeUrl}" style="background-color:#4f46e5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">${welcomeHtmlText}</a>`;

    const message = isMarathi
      ? `सूचना: नवीन स्वयंसेवकाची नोंदणी!\n\nनाव: ${data.v_name}\nईमेल: ${data.v_email}\nफोन: ${data.v_phone}\nकौशल्य: ${data.v_skill}`
      : `Notification: New Volunteer Registration!\n\nName: ${data.v_name}\nEmail: ${data.v_email}\nPhone: ${data.v_phone}\nSkill/Interest: ${data.v_skill}`;

    const response = await emailjs.send(
      SERVICE_ID,
      VOLUNTEER_TEMPLATE_ID,
      {
        name: "Admin",
        email: VOLUNTEER_ADMIN_EMAIL,
        message_subject: subject,
        message: message,
        welcome_html: welcomeHtml,
      },
      PUBLIC_KEY
    );
    console.log("ADMIN ALERT SUCCESS!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("ADMIN ALERT FAILED...", error);
    throw error;
  }
};

export const sendAdminDonationAlertEmail = async (data: {
  d_name: string;
  d_email: string;
  d_phone: string;
  d_amount: number;
  d_utr: string;
  lang?: string;
}) => {
  try {
    const isMarathi = data.lang === "mr";

    const subject = isMarathi
      ? `नवीन देणगी प्राप्त: ₹${data.d_amount} - ${data.d_name}`
      : `New Donation Received: ₹${data.d_amount} - ${data.d_name}`;

    const message = isMarathi
      ? `सूचना: नवीन देणगीची नोंद!\n\nनाव: ${data.d_name}\nईमेल: ${data.d_email}\nफोन: ${data.d_phone}\nरक्कम: ₹${data.d_amount}\nUTR क्रमांक: ${data.d_utr}\n\nकृपया बँक खात्यात रक्कम जमा झाल्याची खात्री करा.`
      : `Notification: New Donation!\n\nName: ${data.d_name}\nEmail: ${data.d_email}\nPhone: ${data.d_phone}\nAmount: ₹${data.d_amount}\nUTR Number: ${data.d_utr}\n\nPlease verify the receipt in the bank account.`;

    const response = await emailjs.send(
      SERVICE_ID,
      VOLUNTEER_TEMPLATE_ID,
      {
        name: "Admin",
        email: DONOR_ADMIN_EMAIL,
        message_subject: subject,
        message: message,
        welcome_html: "",
      },
      PUBLIC_KEY
    );
    console.log("ADMIN DONATION ALERT SUCCESS!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("ADMIN DONATION ALERT FAILED...", error);
    throw error;
  }
};
