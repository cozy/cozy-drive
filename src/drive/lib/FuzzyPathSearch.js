import { remove as removeDiacritics } from 'diacritics'

// Search for keywords inside a list of files and folders, while being permissive regardig the order of words
class FuzzyPathSearch {
  constructor(files = []) {
    // files must have a `path` and `name` property
    this.files = files
    this.previousQuery = []
    this.previousSuggestions = files
  }

  search(query) {
    if (!query) return []

    const queryArray = removeDiacritics(
      query.replace(/\//g, ' ').trim().toLowerCase()
    ).split(' ')
    const preparedQuery = queryArray.map(word => ({
      word,
      isAugmentedWord: false,
      isNewWord: true
    }))

    const isQueryAugmented = this.isAugmentingPreviousQuery(preparedQuery)
    const sortedQuery = isQueryAugmented
      ? this.sortQueryByRevelance(preparedQuery)
      : this.sortQuerybyLength(preparedQuery)
    let suggestions

    if (isQueryAugmented && this.previousSuggestions.length !== 0) {
      // the new query is just a more selective version of the previous one, so we narrow down the existing list
      suggestions = this.filterAndScore(
        this.previousSuggestions,
        sortedQuery.map(segment => segment.word)
      )
    } else {
      suggestions = this.filterAndScore(
        this.files,
        sortedQuery.map(segment => segment.word)
      )
    }

    this.previousQuery = sortedQuery
    this.previousSuggestions = suggestions

    return suggestions
  }

  isAugmentingPreviousQuery(query) {
    for (let currentQuerySegment of query) {
      let isInPreviousQuery = false
      for (let previousQuerySegment of this.previousQuery) {
        if (currentQuerySegment.word.includes(previousQuerySegment.word)) {
          isInPreviousQuery = true
          break
        }
      }

      // we found a word in the current query that was not included in the previous query, so we consider it a completely new query
      if (isInPreviousQuery === false) return false
    }

    // all words are in the previous query
    return true
  }

  sortQueryByRevelance(query) {
    // query terms are sorted in two categories: those that are new or have changed, and therefore may further reduce the set of results, are prioritzed. Those that were there and have not changed come second.
    // finally, longer words are placed first to allow discarding files earlier in the scoring loop
    let priorizedWords = []
    let wordsFromPreviousQuery = []

    for (let currentQuerySegment of query) {
      let wasInPreviousQuery = false
      for (let previousQuerySegment of this.previousQuery) {
        if (currentQuerySegment.word.includes(previousQuerySegment.word)) {
          if (currentQuerySegment.word !== previousQuerySegment.word) {
            currentQuerySegment.isAugmentedWord = true
            priorizedWords.push(currentQuerySegment)
          } else {
            currentQuerySegment.isNewWord = false
            wordsFromPreviousQuery.push(currentQuerySegment)
          }

          wasInPreviousQuery = true
          continue
        }
      }

      // this segment wasn't included in any previous query segment so it's a new word and we prioritize it
      if (!wasInPreviousQuery) priorizedWords.push(currentQuerySegment)
    }

    return this.sortQuerybyLength(priorizedWords).concat(
      this.sortQuerybyLength(wordsFromPreviousQuery)
    )
  }

  sortQuerybyLength(query) {
    return query.sort((a, b) => b.word.length - a.word.length)
  }

  filterAndScore(files, words) {
    const suggestions = []

    files.forEach(file => {
      let fileScore = 0
      const pathArray = removeDiacritics(
        (file.path + '/' + file.name).toLowerCase()
      )
        .split('/')
        .filter(pathChunk => !!pathChunk)

      for (let word of words) {
        // let the magic begin...
        // essentialy, matched words that are at the end of the path get better scores
        let wordScore = 0
        let wordOccurenceValue = 10000
        let firstOccurence = true
        const maxDepth = pathArray.length

        for (let depth = 0; depth < maxDepth; ++depth) {
          let dirName = pathArray[depth]

          if (dirName.includes(word)) {
            if (firstOccurence) {
              wordOccurenceValue = 52428800 // that's 2^19 * 100
              wordScore +=
                (wordOccurenceValue / 2) * (1 + word.length / dirName.length)
              firstOccurence = false
            } else {
              wordScore -=
                wordOccurenceValue * (1 - word.length / dirName.length)
            }

            wordOccurenceValue /= 2
          } else {
            wordScore -= wordOccurenceValue
            wordOccurenceValue /= 2
            if (depth === maxDepth - 1) {
              // make the penality bigger if the last part of the path doesn't include the word at all
              wordScore /= 2
            }
          }

          wordOccurenceValue /= 2
        }

        if (wordScore < 0) return

        fileScore += wordScore
      }

      if (fileScore > 0) {
        suggestions.push({
          file,
          score: fileScore
        })
      }
    })

    suggestions.sort((a, b) => {
      const score = b.score - a.score
      return score !== 0 ? score : a.file.path.localeCompare(b.file.path)
    })

    return suggestions.map(suggestion => suggestion.file)
  }
}

export default FuzzyPathSearch
