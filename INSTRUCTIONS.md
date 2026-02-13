# How to Customize Your Doseh Valentine's Card

You're almost done! The last step is to add your own photos and memories.

## 1. Prepare Your Photos
- Gather about **10-15 photos** you want to use.
- Crop them to be roughly square if possible (especially for the game), but it's not strictly necessary.
- **Option A (Local Files)**: Create a folder inside `Doseh` called `photos` and put your images there (e.g., `photos/beach.jpg`).
- **Option B (Online)**: Upload them to a site like Imgur or Google Photos (direct link) and copy the URL.

## 2. Update the Hero Story (Section 1)
Open `script.js` and look for the **Story Data** section (around line 12).
Change the `img` link for each step to your photo path.
```javascript
const storySteps = [
    { text: "Good morning Doseh! <span class='emoji'>❤️</span>", img: "photos/morning.jpg", size: "normal" },
    // ...
];
```

## 3. Update the Card Interior (Section 2)
Open `index.html`.
- **Left Page (Photo)**: Look for line ~67. Change the `src` of the image inside `.photo-placeholder.left-photo`.
  ```html
  <img src="photos/us_together.jpg" alt="Your Photo" class="insert-photo">
  ```
- **Right Page (Letter)**: Look for line ~78. Change the `src` to a photo of your handwritten letter.
  ```html
  <img src="photos/my_letter.jpg" alt="Your Letter" class="insert-photo">
  ```

## 4. Update the Memory Game (Section 3)
Open `script.js` and scroll down to the **Data** section (around line 108).
Update the `text` and `img` for each of the 10 memories.
```javascript
const memories = [
    { id: 1, text: "Remember that time we went to the beach?", img: "photos/beach.jpg" },
    { id: 2, text: "Our first coffee date.", img: "photos/coffee.jpg" },
    // ...
];
```

## 5. Test It!
Save the files and open `index.html` in your browser to see your beautiful custom card!
