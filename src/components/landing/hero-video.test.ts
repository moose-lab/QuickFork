import { describe, expect, it, vi } from "vitest";

import { startManagedHeroVideoPlayback } from "./HeroSection";

describe("Hero video playback", () => {
  it("falls back to muted playback when the browser blocks audible autoplay", async () => {
    const video = document.createElement("video");
    const blocked = new DOMException("blocked", "NotAllowedError");
    const play = vi.fn().mockRejectedValueOnce(blocked).mockResolvedValueOnce(undefined);
    Object.defineProperty(video, "play", { configurable: true, value: play });

    await startManagedHeroVideoPlayback(video);

    expect(play).toHaveBeenCalledTimes(2);
    expect(video.muted).toBe(true);
  });

  it("restores sound on the first user interaction after muted fallback", async () => {
    const video = document.createElement("video");
    const play = vi.fn().mockRejectedValueOnce(new DOMException("blocked", "NotAllowedError")).mockResolvedValue(undefined);
    Object.defineProperty(video, "play", { configurable: true, value: play });

    await startManagedHeroVideoPlayback(video);
    window.dispatchEvent(new Event("pointerdown"));

    expect(video.muted).toBe(false);
    expect(play).toHaveBeenCalledTimes(3);
  });
});
