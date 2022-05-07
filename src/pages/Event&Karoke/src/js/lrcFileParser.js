import { stringToSeconds } from './time';


export function parseLrcFile(fileData) {
  let fileLines = fileData.replace('\r', '').split('\n');
  let parsedLrcFile = {
    title: '',
    artist: '',
    karaoke: [],
  };

  for (let line of fileLines) {
    let trimmedLine = line.trim();
    if (trimmedLine.length > 0) {
      const lrcLine = parseLrcLine(trimmedLine);
      if (lrcLine !== null){
        if ('artist' in lrcLine) {
          parsedLrcFile.artist = lrcLine.artist;
        }
        else if ('title' in lrcLine) {
          parsedLrcFile.title = lrcLine.title;
        }
        else {
          addLyricLine(parsedLrcFile.karaoke, lrcLine);
        }
      }
    }
  }
  parsedLrcFile.changeEnd = (parsedLrcFile.karaoke[parsedLrcFile.karaoke.length - 1].end === 0) ? true : false;
  return parsedLrcFile;
}

function parseLrcLine(line) {
  /** Lyric Line format
  * {
  *   time: TIME_IN_SECS (float),
  *   lyric: TEXT (str)
  * }
  * Meta Line format
  * {
  *   artist: TEXT (str)
  * }
  * OR
  * {
  *   title: TEXT (str)
  * }
  */
  let bracketRegex = /\[[^\]]*\]/g;

  let bracketMatches = line.match(bracketRegex);
  if (bracketMatches.length > 0) {
    let bracketMatch = bracketMatches[0];
    if (bracketMatch.indexOf(bracketMatch) !== 0) {
      throw new Error(`First bracket text not at beginning of line: ${line}`);
    }

    // -2 to account for both brackets
    let textInsideBrackets = bracketMatch.substr(1, bracketMatch.length - 2);

    let colonIndex;
    if (isTimeStamp(textInsideBrackets)) {
      return parseLyricLine(line, textInsideBrackets);
    }
    else if ((colonIndex = textInsideBrackets.indexOf(':')) !== -1) {
      return parseMetaLine(textInsideBrackets, colonIndex);
    }
  }
  throw new Error(`Line found without bracket text: ${line}`);
}

function parseLyricLine(line, textInsideBrackets) {
  let lyric = line.substr(line.indexOf(']') + 1);
  let timestamp = stringToSeconds(textInsideBrackets);
  return {
    time: timestamp,
    lyric: lyric
  };
}

function parseMetaLine(textInsideBrackets, colonIndex) {
  let [field, text] = [textInsideBrackets.slice(0, colonIndex),
    textInsideBrackets.slice(colonIndex + 1).trim()];
  switch(field) {
  case 'ar':
    return {artist: text};
  case 'ti':
    return {title: text};
  default:
    return null;
  }
}

function isTimeStamp(text) {
  let timestampRegex = /\d\d:\d\d\.\d\d/;
  let timestampMatch = text.match(timestampRegex);
  if (timestampMatch) {
    if (timestampMatch[0] === text) {
      return true;
    }
  }
  return false;
}

function addLyricLine(karaoke, lrcLine) {
  // how long to define a break in a song to display on the karaoke lyrics
  const BREAK_TIME = 4;
  const BREAK_TEXT = '....';
  const BREAK_PAD_SECS = 1;

  const NUM_LYRICS = karaoke.length;
  const LAST_KARAOKE_INDEX = NUM_LYRICS - 1;

  const PLACEHOLDER = 0;
  let previousLyric = (NUM_LYRICS === 0) ? {end: PLACEHOLDER} : karaoke[LAST_KARAOKE_INDEX];

  if (karaoke.length !== 0) {
    previousLyric.end = lrcLine.time;
    if (previousLyric.end <= lrcLine.start) {
      throw new Error(`LRC times not properly sorted at line ${NUM_LYRICS}`);
    }
    previousLyric.letters = calculateLetterTimes(previousLyric.start, previousLyric.lyric, previousLyric.end);
  }
  if (lrcLine.lyric !== '') {
    if ((lrcLine.time - previousLyric.end) >= BREAK_TIME) {
      const start = previousLyric.end + BREAK_PAD_SECS;
      const end = lrcLine.time - BREAK_PAD_SECS;
      karaoke.push({
        start: start,
        lyric: BREAK_TEXT,
        end: end,
        letters: calculateLetterTimes(start, BREAK_TEXT, end)
      });
    }
    karaoke.push({
      start: lrcLine.time,
      lyric: lrcLine.lyric,
      end: PLACEHOLDER,
      letters: []
    });
  }
}

export function calculateLetterTimes(start, lyric, end) {
  const timeInterval = (end - start) / lyric.length;
  return lyric.split('').map((letter, index) => start + (timeInterval * index));
}
