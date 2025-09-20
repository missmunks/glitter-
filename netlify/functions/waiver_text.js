    import { ensureSchema } from './_db_util.js';

    export const handler = async () => {
      await ensureSchema();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `CARAMEL APPLE BAR — BUILD YOUR OWN ADVENTURE
LIABILITY WAIVER AND RELEASE — VERSION 7 (v7)

Event: Caramel Apple Bar + Chocolate Fountain (the “Event”)
Host/Organizer: [Your Name/Organization]
Event Date: _____________   Location: _____________

Please read carefully. By signing electronically, you agree to the following terms.

1) Assumption of Risk
   I understand that the Event involves food preparation by participants, including
   slicing apples and other toppings, dipping in hot caramel and melted chocolate,
   and handling skewers/sticks and nuts. I recognize the risks of burns, cuts,
   allergic reactions, slips/spills, and general foodborne illness. I knowingly and
   voluntarily accept all risks, both known and unknown, associated with attending
   and participating in this “Build Your Own Adventure” caramel apple experience.

2) Allergens & Dietary Needs
   Foods and toppings may contain or come into contact with common allergens,
   including but not limited to peanuts, tree nuts, milk, soy, gluten, and sesame.
   Cross-contact is possible. I am solely responsible for reviewing ingredients
   and managing my own (or my child’s) dietary restrictions.

3) Supervision of Minors
   I am responsible for the supervision and safety of any minor(s) I bring.
   I will ensure that children use caution around hot caramel, chocolate, knives,
   skewers, and potentially slippery surfaces.

4) Release of Liability
   To the fullest extent permitted by law, I release and hold harmless the Host/Organizer,
   property owners, volunteers, and vendors from any and all claims, liabilities, damages,
   or expenses arising from my participation (or my child’s participation) in the Event,
   including those arising from ordinary negligence.

5) Medical Authorization
   In the event of injury or illness, I authorize the Host/Organizer to obtain emergency
   medical care. I accept full financial responsibility for any costs incurred.

6) Photo/Video Consent (Optional)
   ☐ I consent to the use of photos/videos of me or my child from the Event for non-commercial
     social media and recap purposes by the Host/Organizer.

7) Electronic Signature & Verification
   I agree that my electronic signature and code verification constitute my signature
   for this Waiver (v7). I certify that the information I provide is accurate to the
   best of my knowledge.

8) Acknowledgement
   By signing below, I acknowledge that I have read and understood this Waiver, and I accept
   its terms voluntarily.

Participant Full Name: ______________________________   Date: _____________
Signature (typed): ___________________________________
Contact (email or mobile): ___________________________
` })
      };
    };
