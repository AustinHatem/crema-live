export const fonts = {
  regular: 'Roobert',
  bold: 'Roobert-Bold',
  medium: 'Roobert-SemiBold',
  light: 'Roobert',  // Fallback to regular
  heavy: 'Roobert-Bold',  // Fallback to bold
  // Additional fallbacks
  thin: 'Roobert',  // Fallback to regular
  black: 'Roobert-Bold',  // Fallback to bold
  ultra: 'Roobert-Bold',  // Fallback to bold
};

export const colors = {
  primary: '#f73558',
  black: '#000',
  white: '#FFF',
  gray: '#999',
  lightGray: '#CCC',
  darkGray: '#333',
  background: '#0a0a0a',
  surface: '#1a1a1a',
};

export const globalStyles = {
  text: {
    fontFamily: fonts.regular,
  },
  boldText: {
    fontFamily: fonts.bold,
  },
  mediumText: {
    fontFamily: fonts.medium,
  },
  lightText: {
    fontFamily: fonts.light,
  },
  thinText: {
    fontFamily: fonts.thin,
  },
  heavyText: {
    fontFamily: fonts.heavy,
  },
  blackText: {
    fontFamily: fonts.black,
  },
  ultraText: {
    fontFamily: fonts.ultra,
  },
};