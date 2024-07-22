let array = [];
let audioCtx = null;

let title = null; 
let paragraph = null;


function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    osc.connect(node);
    node.connect(audioCtx.destination);
}

// funzione init collegata al form

function init() {
    const inputValue = document.getElementById("number-input").value;
    const n = parseInt(inputValue);

    if (isNaN(n) || n < 2) {
        alert("Please enter a number greater than 1");
        return;
    }

    array = [];
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}


// funzioni per ogni algoritmo 

function playBubbleSort() {
    info("Bubble Sort");
    const copy = [...array];
    const moves = bubbleSort(copy);
    animate(moves);
}

function playSelectionSort() {
    info("Selection Sort");
    const copy = [...array];
    const moves = selectionSort(copy);
    animate(moves);
}

function playInsertionSort() {
    info("Insertion Sort");
    const copy = [...array];
    const moves = insertionSort(copy);
    animate(moves);
}

function playMergeSort() {
    info("Merge Sort");
    const copy = [...array];
    const moves = mergeSort(copy);
    animate(moves);
}

function playQuickSort() {
    info("Quick Sort");
    const copy = [...array];
    const moves = quickSort(copy);
    animate(moves);
}

function playHeapSort() {
    info("Heap Sort");
    const copy = [...array];
    const moves = heapSort(copy);
    animate(moves);
}

function animate(moves) {
    if (moves.length == 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    } else if (move.type == "overwrite") {
        array[i] = move.value;
    }

    playNote(200 + array[i] * 500);
    if (move.type === "swap") playNote(200 + array[j] * 500);
    showBars(move);
    setTimeout(function () {
        animate(moves);
    }, 80);
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indices: [i - 1, i], type: "comp" });
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [minIndex, j], type: "comp" });
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            moves.push({ indices: [i, minIndex], type: "swap" });
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }
    return moves;
}

function insertionSort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            moves.push({ indices: [j - 1, j], type: "comp" });
            moves.push({ indices: [j - 1, j], type: "swap" });
            [array[j], array[j - 1]] = [array[j - 1], array[j]];
            j--;
        }
    }
    return moves;
}

function mergeSort(array) {
    const moves = [];
    if (array.length < 2) return [];

    const merge = (left, right, start) => {
        let result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            moves.push({ indices: [start + i, start + left.length + j], type: "comp" });
            if (left[i] < right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        while (i < left.length) result.push(left[i++]);
        while (j < right.length) result.push(right[j++]);

        for (let k = 0; k < result.length; k++) {
            moves.push({ indices: [start + k], type: "overwrite", value: result[k] });
        }

        return result;
    };

    const mergeSortRecursive = (arr, start) => {
        if (arr.length < 2) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = mergeSortRecursive(arr.slice(0, mid), start);
        const right = mergeSortRecursive(arr.slice(mid), start + mid);
        return merge(left, right, start);
    };

    mergeSortRecursive(array, 0);
    return moves;
}

function quickSort(array) {
    const moves = [];
    const partition = (arr, low, high) => {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            moves.push({ indices: [j, high], type: "comp" });
            if (arr[j] < pivot) {
                i++;
                moves.push({ indices: [i, j], type: "swap" });
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        moves.push({ indices: [i + 1, high], type: "swap" });
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    };

    const quickSortRecursive = (arr, low, high) => {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        }
    };

    quickSortRecursive(array, 0, array.length - 1);
    return moves;
}

function heapSort(array) {
    const moves = [];
    const heapify = (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            moves.push({ indices: [left, largest], type: "comp" });
            if (arr[left] > arr[largest]) largest = left;
        }

        if (right < n) {
            moves.push({ indices: [right, largest], type: "comp" });
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest != i) {
            moves.push({ indices: [i, largest], type: "swap" });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    };

    const heapSortAlgorithm = (arr) => {
        const n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            moves.push({ indices: [0, i], type: "swap" });
            [arr[0], arr[i]] = [arr[i], arr[0]];
            heapify(arr, i, 0);
        }
    };

    heapSortAlgorithm(array);
    return moves;
}

function showBars(move) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  // ciclo for per creare tot elementi all'interno del container
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "purple" : "green";
    }
    container.appendChild(bar);
  }
}

// funzione per creare paragrafo descrittivo per ogni algoritmo 

function info(nameOfFunction) {
  const displayInfo = document.getElementById("displayInfo");

  if (!title) {
      title = document.createElement("h2");
      displayInfo.appendChild(title);
  }
  
  title.innerHTML = nameOfFunction;

  if (!paragraph) {
      paragraph = document.createElement("p");
      displayInfo.appendChild(paragraph);
  }

  if (nameOfFunction === "Bubble Sort") {
      paragraph.innerHTML = "is a simple comparison-based sorting algorithm. It works by repeatedly stepping through the list to be sorted, comparing adjacent items and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.";
  } else if (nameOfFunction === "Selection Sort") {
      paragraph.innerHTML = "is a simple and efficient sorting algorithm that works by repeatedly selecting the smallest (or largest) element from the unsorted portion of the list and moving it to the sorted portion of the list.";
  } else if (nameOfFunction === "Insertion Sort") {
      paragraph.innerHTML = "is a simple and intuitive sorting algorithm that builds the final sorted array (or list) one item at a time. During each iteration, the algorithm removes one element from the input data, finds the location it belongs to within the sorted list, and inserts it there. It repeats until no input elements remain.";
  } else if (nameOfFunction === "Merge Sort") {
      paragraph.innerHTML = "is a divide-and-conquer algorithm that divides the array into smaller subarrays, sorts each subarray, and then merges them back together to form a sorted array.";
  } else if (nameOfFunction === "Quick Sort") {
      paragraph.innerHTML = "is a highly efficient sorting algorithm that uses a divide-and-conquer approach to select a pivot element, partition the array into subarrays around the pivot, and then recursively sort the subarrays.";
  } else if (nameOfFunction === "Heap Sort") {
      paragraph.innerHTML = "is a comparison-based sorting algorithm that uses a binary heap data structure to sort elements by repeatedly removing the largest element from the heap and rebuilding the heap.";
  }
}

function adjustMaxAttribute() {
    const input = document.getElementById('number-input');
    if (window.innerWidth < 769) {
        input.setAttribute('max', '20');
    } else {
        input.setAttribute('max', '50');
    }
}
// Adjust the max attribute on page load
adjustMaxAttribute();

// Adjust the max attribute on window resize
window.addEventListener('resize', adjustMaxAttribute);