// List of all JPG files in public/photos/
// This will be used to dynamically generate photo windows
// Add new photos here as you add them to the folder

export const PHOTO_FILES = [
  'our_first_concert_together.JPG',
  'our_nyc_trip_together',
  'when_i_accidentally_ordered_you_avocado.jpg',
  'my_shock_after_paying_for_our_ meals.JPG',
  'you_truly_make_me_the_happiest_man_ever.jpeg',
];


// Helper function to generate photo windows with layered arrangement
export const generatePhotoWindows = () => {
  const windowWidth = 1000; // 2x larger (was 500px)
  const windowHeight = 800; // 768px content + 32px chrome (title bar + status bar)
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  
  // Calculate positions for 2x2 grid with overlapping
  // Each window overlaps by approximately 200-300px
  const overlap = 250;
  const startX = screenWidth / 2 - windowWidth - overlap / 2 + screenWidth * 0.1; // Move 10% to the right
  const startY = (screenHeight / 2 - windowHeight - overlap / 2) + screenHeight * 0.2; // Move 30% down
  
  // Define positions and z-indexes for each photo based on the screenshot
  // Order: Hidden photo (z:0), my_favourite_photo_with_you (top-left, z:1), 
  //        our_nyc_trip_together (top-right, z:2), my_shock_after_paying (bottom-left, z:3), 
  //        when_i_accidentally_ordered (bottom-right, z:4)
  const photoConfig = [
    {
      filename: 'you_truly_make_me_the_happiest_man_ever.jpeg',
      position: { x: startX + (windowWidth - overlap) / 2, y: startY + (windowHeight - overlap) / 2 },
      zIndex: 0, // Hidden underneath all other photos
    },
    {
      filename: 'my_favourite_photo_with_you.JPG',
      position: { x: startX, y: startY },
      zIndex: 1, // Lowest visible layer
    },
    {
      filename: 'our_nyc_trip_together.JPG',
      position: { x: startX + windowWidth - overlap, y: startY },
      zIndex: 2, // Overlaps my_favourite_photo_with_you on the left
    },
    {
      filename: 'my_shock_after_paying_for_our_ meals.JPG',
      position: { x: startX, y: startY + windowHeight - overlap },
      zIndex: 3, // Overlaps my_favourite_photo_with_you on the top
    },
    {
      filename: 'when_i_accidentally_ordered_you_avocado.jpg',
      position: { x: startX + windowWidth - overlap, y: startY + windowHeight - overlap },
      zIndex: 4, // Highest layer, overlaps both our_nyc_trip_together and my_shock_after_paying
    },
  ];

  return photoConfig.map((config) => {
    return {
      id: `photo-${config.filename.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title: config.filename,
      content: '',
      imageUrl: `/photos/${config.filename}`,
      isOpen: true,
      isMinimized: false,
      position: { 
        x: Math.max(0, config.position.x),
        y: Math.max(24, config.position.y) // Account for top menu bar (24px)
      },
      zIndex: config.zIndex,
    };
  });
};
