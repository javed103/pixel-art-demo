let gridSize = 8;
let selectedColor = '#000000';
let fillMode = false;

// Create the grid
function createGrid(size) {
    let gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 30px)`;

    for (let i = 0; i < size * size; i++) {
        let pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.addEventListener('click', function () {
            if (fillMode) {
                fill(pixel);
            } else {
                pixel.style.backgroundColor = selectedColor;
            }
        });
        gridContainer.appendChild(pixel);
    }
}

// Change grid size
function changeGridSize(size) {
    gridSize = size;
    createGrid(size);
}

// Select color from the palette
let colors = document.getElementsByClassName('color');
for (let i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', function () {
        selectedColor = this.style.backgroundColor;
    });
}

 fillMode = false;  // Variable to check if fill mode is active

// Toggle Paint-Bucket (Fill Tool) mode
function toggleFillTool() {
    fillMode = !fillMode;  // Toggle fill mode state
    const paintBucketButton = document.getElementById('paint-bucket');
    paintBucketButton.style.backgroundColor = fillMode ? 'lightgreen' : '';  // Change button color to indicate mode
}

// Function to fill adjacent pixels recursively (flood-fill algorithm)
function fill(startPixel) {
    const targetColor = startPixel.style.backgroundColor;  // Color of the pixel where we clicked
    if (targetColor === selectedColor) return;  // If already filled with the selected color, return

    const stack = [startPixel];  // Stack for flood-fill
    while (stack.length > 0) {
        const current = stack.pop();
        if (current.style.backgroundColor === targetColor) {
            current.style.backgroundColor = selectedColor;  // Change color

            // Get neighbors and continue the fill
            const neighbors = getNeighbors(current);
            for (const neighbor of neighbors) {
                if (neighbor && neighbor.style.backgroundColor === targetColor) {
                    stack.push(neighbor);  // Add neighbor to stack if color matches
                }
            }
        }
    }
}

// Get neighboring pixels (up, down, left, right)
function getNeighbors(pixel) {
    const pixels = document.getElementsByClassName('pixel');
    const index = Array.from(pixels).indexOf(pixel);  // Get pixel index in the grid
    const neighbors = [];

    // Ensure we're not out of bounds and find neighbors
    if (index >= gridSize) neighbors.push(pixels[index - gridSize]);  // Up
    if (index < gridSize * (gridSize - 1)) neighbors.push(pixels[index + gridSize]);  // Down
    if (index % gridSize !== 0) neighbors.push(pixels[index - 1]);  // Left
    if (index % gridSize !== gridSize - 1) neighbors.push(pixels[index + 1]);  // Right

    return neighbors;
}

// Save the grid and color palette as an image (skipping buttons and labels)
function savePageAsImage() {
    const appElement = document.getElementById('app');

    // Temporarily hide elements you don't want in the screenshot
    document.getElementById('grid-size').classList.add('hidden');
    document.getElementById('downloadbtn').classList.add('hidden');
    document.getElementById('paint-bucket').classList.add('hidden');
    document.getElementById('format-selection').classList.add('hidden');

    html2canvas(appElement).then(function(canvas) {
        // Bring back hidden elements after capturing
        document.getElementById('grid-size').classList.remove('hidden');
        document.getElementById('downloadbtn').classList.remove('hidden');
        document.getElementById('paint-bucket').classList.remove('hidden');
        document.getElementById('format-selection').classList.remove('hidden');

        // Convert to the selected file format
        const format = document.getElementById('file-format').value;
        let dataURL;
        if (format === 'jpg') {
            dataURL = canvas.toDataURL('image/jpeg');
        } else if (format === 'gif') {
            dataURL = canvas.toDataURL('image/gif');
        } else {
            dataURL = canvas.toDataURL('image/png');
        }

        // Trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        const timestamp = new Date().getTime();
        downloadLink.download = `pixel_art_${gridSize}x${gridSize}_${timestamp}.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}

// Initialize the grid with default size
createGrid(gridSize);
