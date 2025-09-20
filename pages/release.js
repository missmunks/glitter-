export default function Release(){
  const text = `By attending this event, you agree that caramel is sticky, chocolate is messy, pumpkins are paintable, and chaos is inevitable. We take no responsibility for sugar highs, glitter explosions, or chocolate fountain hair dips.`;
  const sizes = ["text-4xl", "text-2xl", "text-base", "text-[10px]"];
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">⚠️ Release of Liability</h1>
      {sizes.map((s, i) => (
        <p key={i} className={`${s} mb-6`}>{text}</p>
      ))}
    </div>
  );
}
