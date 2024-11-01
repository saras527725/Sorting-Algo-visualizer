// Number of bars to be displayed
var barsCount = 256;
var heights = [];
var sorted = false;

// Create bars for visualization
function makeBars() {
    for (let i = 1; i <= barsCount / 2; ++i) {
        $("#sort-container").append("<div class='bar'></div>");
    }
}

makeBars();
var bars = $(".bar");

// Set random heights for bars
function setRandomBars() {
    heights = [];
    for (let i = 1; i <= barsCount / 2; ++i) {
        heights.push(i * 3);
    }
    shuffle(heights);
}

// Shuffle bars
async function shuffle(heights) {
    var currentIndex = heights.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = heights[currentIndex];
        heights[currentIndex] = heights[randomIndex];
        heights[randomIndex] = temporaryValue;
        $(bars[currentIndex]).height(heights[currentIndex]);
        $(bars[randomIndex]).height(heights[randomIndex]);
        await timer(1);
    }
    for (let i = 0; i < bars.length; ++i) $(bars[i]).height(heights[i]);
    return heights;
}

// Delay function for animations
function timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

// Swap two heights
function swap(heights, first_Index, second_Index) {
    var temp = heights[first_Index];
    heights[first_Index] = heights[second_Index];
    heights[second_Index] = temp;
}

// Sorting Algorithms
async function insertionSort(heights) {
    for (let i = 1; i < heights.length; ++i) {
        let el = heights[i];
        let j = i;
        while (j > 0 && heights[j - 1] > el) {
            heights[j] = heights[j - 1];
            $(bars[j]).height(heights[j]);
            await timer(1);
            --j;
        }
        heights[j] = el;
        $(bars[j]).height(heights[j]);
        await timer(1);
    }
}

// Selection Sort
async function selectionSort(heights) {
    for (let i = 0; i < heights.length; ++i) {
        let minIdx = i;
        for (let j = i + 1; j < heights.length; ++j) {
            if (heights[j] < heights[minIdx]) minIdx = j;
        }
        swap(heights, i, minIdx);
        $(bars[i]).height(heights[i]);
        $(bars[minIdx]).height(heights[minIdx]);
        await timer(50);
    }
}

// Bubble Sort
async function bubbleSort(heights) {
    for (let i = heights.length - 1; i >= 0; --i) {
        for (let j = 1; j <= i; ++j) {
            if (heights[j - 1] > heights[j]) {
                swap(heights, j - 1, j);
                $(bars[j]).height(heights[j]);
                $(bars[j - 1]).height(heights[j - 1]);
                await timer(1);
            }
        }
    }
}

// Quick Sort
async function quickSort(heights, left, right) {
    if (heights.length > 1) {
        let pivot = heights[Math.floor((right + left) / 2)],
            i = left,
            j = right;
        while (i <= j) {
            while (heights[i] < pivot) i++;
            while (heights[j] > pivot) j--;
            if (i <= j) {
                swap(heights, i, j);
                $(bars[i]).height(heights[i]);
                $(bars[j]).height(heights[j]);
                await timer(50);
                i++;
                j--;
            }
        }
        if (left < i - 1) quickSort(heights, left, i - 1);
        if (i < right) quickSort(heights, i, right);
    }
}

// Merge Sort
async function mergeSort(heights) {
    for (let curr_size = 1; curr_size <= heights.length - 1; curr_size = 2 * curr_size) {
        for (let left_start = 0; left_start < heights.length - 1; left_start += 2 * curr_size) {
            let mid = Math.min(left_start + curr_size - 1, heights.length - 1);
            let right_end = Math.min(left_start + 2 * curr_size - 1, heights.length - 1);
            let n1 = mid - left_start + 1;
            let n2 = right_end - mid;
            let L = heights.slice(left_start, mid + 1);
            let R = heights.slice(mid + 1, right_end + 1);
            let i = 0, j = 0, k = left_start;
            while (i < n1 && j < n2) {
                if (L[i] <= R[j]) {
                    heights[k] = L[i];
                    i++;
                } else {
                    heights[k] = R[j];
                    j++;
                }
                $(bars[k]).height(heights[k]);
                await timer(1);
                k++;
            }
            while (i < n1) {
                heights[k] = L[i];
                $(bars[k]).height(heights[k]);
                await timer(1);
                i++;
                k++;
            }
            while (j < n2) {
                heights[k] = R[j];
                $(bars[k]).height(heights[k]);
                await timer(1);
                j++;
                k++;
            }
        }
    }
}

// Set bars to sorted color
function setSortedBars() {
    bars.each(function() {
        $(this).addClass('sorted');
    });
}

// Event listeners for buttons
$("#init").click(function(e) {
    e.preventDefault();
    if (sorted) return;
    sorted = true;
    let option = $("#list").val();
    if (option === "insertion") insertionSort(heights);
    else if (option === "selection") selectionSort(heights);
    else if (option === "bubble") bubbleSort(heights);
    else if (option === "quick") quickSort(heights, 0, heights.length - 1);
    else if (option === "merge") mergeSort(heights);
    setSortedBars();
});

$("#shuffle").click(function(e) {
    e.preventDefault();
    setRandomBars();
    sorted = false;
});
