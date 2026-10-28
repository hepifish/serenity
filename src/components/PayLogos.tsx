// Netopia asks for the card scheme marks and its own name near the payment.
// Drawn inline, monochrome, so they sit quietly in the dark palette.
export default function PayLogos({ label }: { label?: string }) {
  return (
    <div className="pay-logos">
      {label ? <span>{label}</span> : null}
      <svg viewBox="0 0 48 16" role="img" aria-label="Visa"><text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="15" fill="currentColor">VISA</text></svg>
      <svg viewBox="0 0 30 18" role="img" aria-label="Mastercard"><circle cx="11" cy="9" r="8" fill="currentColor" opacity=".55" /><circle cx="19" cy="9" r="8" fill="currentColor" opacity=".85" /></svg>
      <svg viewBox="0 0 112 16" role="img" aria-label="NETOPIA Payments"><text x="0" y="12" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" letterSpacing="1.2" fill="currentColor">NETOPIA</text><text x="62" y="12" fontFamily="Arial, sans-serif" fontSize="9" fill="currentColor">Payments</text></svg>
    </div>
  );
}
