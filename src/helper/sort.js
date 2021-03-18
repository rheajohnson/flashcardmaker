export function sortSet(data) {
  return data.sort(function (a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}

export function sortFlashcardList(data) {
  return data.sort(function (a, b) {
    if (a.term.toLowerCase() < b.term.toLowerCase()) {
      return -1;
    }
    if (a.term.toLowerCase() > b.term.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}
