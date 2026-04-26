import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,

    // VoiceMode: useVoiceReducer //defines whether the voice animation is opened or not
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch