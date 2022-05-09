const locations = {
    "00": [0, 0, "R", false, 1],
    "01": [0, 1, "K", false, 1],
    "02": [0, 2, "B", false, 1],
    "04": [0, 4, "Q", false, 1], 
    "03": [0, 3, "M", false, 1],  
    "05": [0, 5, "B", false, 1],
    "06": [0, 6, "K", false, 1],
    "07": [0, 7, "R", false, 1],

    "10": [1, 0, "P", false, 1],  
    "11": [1, 1, "P", false, 1],    
    "12": [1, 2, "P", false, 1],      
    "13": [1, 3, "P", false, 1],  
    "14": [1, 4, "P", false, 1],    
    "15": [1, 5, "P", false, 1],  
    "16": [1, 6, "P", false, 1],  
    "17": [1, 7, "P", false, 1],

    "70": [7, 0, "R", false, 0],
    "71": [7, 1, "K", false, 0],
    "72": [7, 2, "B", false, 0],
    "73": [7, 3, "M", false, 0], 
    "74": [7, 4, "Q", false, 0],
    "75": [7, 5, "B", false, 0],
    "76": [7, 6, "K", false, 0],  
    "77": [7, 7, "R", false, 0],
    
    "60": [6, 0, "P", false, 0],  
    "61": [6, 1, "P", false, 0],    
    "62": [6, 2, "P", false, 0],      
    "63": [6, 3, "P", false, 0],  
    "64": [6, 4, "P", false, 0],    
    "65": [6, 5, "P", false, 0],
    "66": [6, 6, "P", false, 0],
    "67": [6, 7, "P", false, 0]
}

const figures = [new Map([["Q", "♛"], ["M", "♚"], ["R", "♜"],["K", "♞"], ["B", "♝"], ["P", "♟"]]),
                 new Map([["Q", "♕"], ["M", "♔"], ["R", "♖"],["K", "♘"], ["B", "♗"], ["P", "♙"]])]
              

export {locations, figures}