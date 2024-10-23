import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    isLogin: false,
    nickname: '',
    name: '',
    isMale: null,
    phoneNumber: '',
    uuid: '',
    isPopper: false,
    isSocialuser: false,
    socialLoginProvider: '',
    profileImage: '',
  }

};

const userSlice = createSlice({
  name: 'poppingUser',
  initialState,
  reducers: {
    setUser: (state, action) => { state.user = action.payload }, //login
    initUser: (state) => { state.user = initialState.user }, //logout
    changeNickname: (state, action) => {
      state.user.nickname = action.payload;
    },
    changeName: (state, action) => {
      state.user.name = action.payload;
    },
    changeIsMale: (state, action) => {
      state.user.isMale = action.payload;
    },
    changeProfileImage: (state, action) => {
      state.user.profileImage = action.payload;
    },
  }
});

export const { setUser, initUser, changeNickname, changeName, changeIsMale, changeProfileImage } = userSlice.actions;
export default userSlice;
