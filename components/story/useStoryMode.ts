"use client";

import { useSyncExternalStore } from "react";
import {
  getServerStoryMode,
  getStoryMode,
  subscribeStoryMode,
  type StoryMode,
} from "@/lib/story";

export function useStoryMode(): StoryMode {
  return useSyncExternalStore(subscribeStoryMode, getStoryMode, getServerStoryMode);
}
