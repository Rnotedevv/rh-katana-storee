function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M17.5 6.6h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.4 11.7a8.4 8.4 0 1 1-16.8 0 8.4 8.4 0 0 1 16.8 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.2 9.4c.2-.3.4-.3.6-.3h.6c.2 0 .5.1.6.5l.7 1.8c.1.3.1.5-.1.7l-.5.6c-.1.1-.2.3-.1.5.4.7 1.2 1.6 2.3 2.1.2.1.4 0 .5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5 0 .8-.3 1.6-1 2-1 .6-2.3.6-4.1-.2-2.1-.9-4-2.9-5-4.9-.8-1.7-.8-3.1-.2-4.1Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export default function SiteFooter() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const msg = "Hi brother, I want to ask about RH KATANA STORE.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  return (
    <footer id="contact" className="border-t bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="font-semibold">RH KATANA STORE</p>
            <p className="mt-2 text-sm text-neutral-700">BLACKSMITH INDONESIA</p>
            <p className="mt-4 text-sm text-neutral-700">
              <span className="font-medium">Address:</span>
              <br />
              Cisaat District, Sukabumi Regency 43152,
              <br />
              West Java, Indonesia
            </p>
          </div>

          <div>
            <p className="font-semibold">Contacts</p>
            <div className="mt-3 flex flex-col gap-3 text-sm">
              <a
                className="inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                href="https://instagram.com/ryn9__"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon />
                Owner: <span className="font-medium">@ryn9__</span>
              </a>

              <a
                className="inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                href="https://instagram.com/rhkatana"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon />
                Official: <span className="font-medium">@rhkatana</span>
              </a>

              <a
                className="inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                href={waLink}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                WhatsApp (tap to chat)
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold">Help</p>
            <p className="mt-2 text-sm text-neutral-700">
              Shipping worldwide via <b>UPS</b> / <b>DHL</b>
              <br />
              Payment: <b>WU</b> & <b>PayPal</b>
            </p>

            <p className="mt-6 text-xs text-neutral-600">
              © 2025 RH KATANA STORE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
