/** Is the second string a substring of the first one?
 * @param {String} outer
 * @param {String} inner
 * @returns {boolean}
 */
function stringsMatch(outer, inner) {
  const outerAux = outer
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const innerAux = inner
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return outerAux.indexOf(innerAux) !== -1;
}

export { stringsMatch };
