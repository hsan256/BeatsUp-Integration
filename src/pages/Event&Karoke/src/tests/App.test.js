import React from 'react';
import { render } from '@testing-library/react';
import LyricWindow from '../components/KaraokePlayer/LyricWindow';
import { configureStore } from '@reduxjs/toolkit';
import songReducer from '../components/KaraokePlayer/songSlice';
import { Provider } from 'react-redux';
import { readFileSync } from 'fs';

test('check lyric window displays lyrics properly', () => {
  const initialState = JSON.parse(readFileSync('src/tests/shivers.json'));
  const store = configureStore({
    reducer: {
      song: songReducer
    },
    preloadedState: initialState
  });

  const { getByText } = render(<Provider store={store}><LyricWindow /></Provider>);
  expect(getByText('....')).toBeDefined();
  expect(getByText('I took an arrow to the heart')).toBeDefined();
  expect(getByText('I never kissed a mouth that tastes like yours')).toBeDefined();
  expect(getByText('Strawberries and somethin more')).toBeDefined();
});
