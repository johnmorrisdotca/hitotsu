/** Where a line of Japanese may break: after a run of hiragana (a particle, an ending) or a stop, before whatever is not. The words it joins, コンピューター2 or ワイルドドローフォー, are never between two of these, so a line breaks between phrases and never inside a word. */
const BETWEEN_PHRASES = /(?<=[ぁ-ゖ、。！？])(?=[^ぁ-ゖ、。！？゛゜ー」』）\s])/u;

/** A sentence cut into its phrases, so that a line may break between them and nowhere else in Japanese. English is one piece.
 * @param text - A sentence of the table's words.
 * @returns Its phrases, which joined are the sentence exactly.
 */
export function phrases(text: string): string[] {
  return text.split(BETWEEN_PHRASES);
}
