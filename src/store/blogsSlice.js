import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_BLOGS } from "../data/initialData";

const loadedBlogs = loadState("blogs", INITIAL_BLOGS);
const mergedBlogs = loadedBlogs.map(blog => {
  const newInitial = INITIAL_BLOGS.find(ib => ib.id === blog.id);
  if (newInitial) {
    return { ...blog, contentTR: newInitial.contentTR, contentEN: newInitial.contentEN };
  }
  return blog;
});

const initialBlogsState = {
  list: mergedBlogs,
};

export const blogsSlice = createSlice({
  name: "blogs",
  initialState: initialBlogsState,
  reducers: {
    addBlog: (state, action) => {
      state.list.unshift(action.payload);
      saveState("blogs", state.list);
    },
    deleteBlog: (state, action) => {
      state.list = state.list.filter(b => b.id !== action.payload);
      saveState("blogs", state.list);
    }
  },
});

export const { addBlog, deleteBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
