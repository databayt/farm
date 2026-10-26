// The "Register interest" button opens WhatsApp (D-018). Until a number is set, the live page
// hides the button and says the line opens soon; development builds flag the gap instead.
export const WHATSAPP_NUMBER = "" // international format, digits only, e.g. "2507XXXXXXXX"

const WHATSAPP_MESSAGE = "Hello Digital Farm, I would like to register my interest in "

export const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : null
