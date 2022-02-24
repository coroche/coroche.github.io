---
title: Wordle Helper
permalink: /wordle/
layout: page
---
Enter guesses below and colour letters based on results. Then click "Show Possible Solutions". The words populated in the solutions list are all the possible solutions.


<div id="wordle">

    <form id="form" action="/wordle_guess" method="post">
        <h4 class="formTitle" >Guesses</h4>
        {% for i in (1..6) %}
        <guess class="formRow">
            {% for j in (1..5) %}
            <letter class="letter">
                <input type="text" class="tile" id=letter{{i}}{{j}} name=letter{{i}}{{j}} maxlength=1 value='' tabindex=1 datastate="tbd" required />
                <input type="color" class="colourPicker" id=colour{{i}}{{j}} name=colour{{i}}{{j}} value='#ffffff' list="presets" />
            </letter>
            {% endfor %}
        </guess>
        {% endfor %}
        
        <submit class="formRow">
            <div class="button">
                <input type="button" value="Show Possible Solutions" id="submit"  onclick="solve()"/>
            </div>
            <div class="button">
                <input type="button" value="Clear" id="clear" onclick="clearAll()"/>
            </div>
        </submit>

        
        <datalist id="presets">
        <option value="#6aaa64">Right letter, right position</option>
        <option value="#c9b458">Right letter, wrong position</option>
        <option value="#ffffff">White</option>
        </datalist>

    </form>

    <words style="padding: 20px;">
        <h4 class="formTitle" >Words</h4>
        <textarea id="wordList" name="wordList" cols="8" rows="20">{{wordList}}</textarea>
    </words>

</div>

<script src="/assets/js/wordleLogic.js"></script>
<script>
    
    const tiles = Array.from(document.querySelectorAll('.tile'))
    const colourPickers = Array.from(document.querySelectorAll('.colourPicker'))

    var dict = {
        "#6aaa64": "correct",
        "#c9b458": "present",
        "#ffffff": "tbd",
        "correct": "#6aaa64",
        "present": "#c9b458",
        "tbd"    : "#ffffff"
    };

    colourPickers.forEach(function (picker, i) {
        picker.addEventListener("input", function(event) {
            tiles[i].attributes.datastate.value = dict[event.target.value];
            


        }, false);
    })

    tiles.forEach(function (tile, i) {
        tile.addEventListener("input", function(event) {
            if (i < tiles.length - 1 && event.inputType != 'deleteContentBackward') {
                tiles[i+1].select()
            }
        }, false);

        tile.addEventListener("keyup", function(event) {
            if (event.key == 'Backspace') {
                if (i > 0) {
                    tiles[i-1].select()
                } 
            }
            
        }, false);        
    })

    function clearAll() {
        colourPickers.forEach(item => {
            item.value = "#ffffff"
        })

        tiles.forEach(item => {
            item.value = ""
            item.attributes.datastate.value = 'tbd';
        })

        $('.tile').removeAttr('style');
        $('#form').hide().show(0);
        tiles[0].focus();
    }

    function onLoad() {
        tiles[0].focus()
    }

    function solve(tiles, colourPickers){
        const tiles_ret = Array.from(document.querySelectorAll('.tile'))
        const colourPickers_ret = Array.from(document.querySelectorAll('.colourPicker'))
        
        n = 0;
        while (tiles_ret[n].value.trim() != '') {
            n++
        }
        N = Math.floor(n/5); //Number of complete words
        
        const greens = [];
        const oranges = [];
        const elim = [];
        const guesses = [];
    
        for (let i = 0; i < N; i++) {
            greens.push(['_', '_', '_', '_', '_']);
            oranges.push([])
            elim.push([])
            guesses.push('')
        }
        
        for (let i = 0; i < N*5; i++) {
            g = Math.floor(i/5);
            if (colourPickers_ret[i].value == dict['correct']) {
                greens[g][i%5] = tiles_ret[i].value
            } 
            else if (colourPickers_ret[i].value == dict['present']) {
                oranges[g].push([tiles_ret[i].value, i%5])
            } 
            else if (tiles_ret[i].value !== "" && colourPickers_ret[i].value == dict['tbd']) {
                elim[g].push(tiles_ret[i].value)
            }
            guesses[g] = guesses[g] +  tiles_ret[i].value
            
        }

        applyGuesses(greens, oranges, elim, guesses, N)
        document.getElementById('wordList').value = wordList.join('\r\n')
        
    }

    window.onload = onLoad;

</script>

<style>
.tile{
    width: 50px;
    height: 50px;
    text-align: center;
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 600;
    box-sizing: border-box;
}

.tile[datastate='tbd']{
    border-style: solid;
    border-color: '#878a8c';
}

.tile[datastate='present']{
    border-style: none;
    color: #ffffff;
    background-color: #c9b458;
}

.tile[datastate='correct']{
    border-style: none;
    color: #ffffff;
    background-color: #6aaa64;
}

#form{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
}

#wordList{
    margin: auto;
    padding: 10px;
    resize: none;
    text-transform: uppercase;
    white-space: pre;
}

.formRow{
    display: flex;
    justify-content: center;
    padding: 5px;
}

.letter{
    display: flex;
    flex-direction: column;
    padding: 2px;
}

.colourPicker{
    width: 50px;
    height: 20px;
}

.button{
    padding: 5px;
}

#wordle{
    display: flex;
    flex-direction: row;
    width: auto;
    margin: auto;
    margin-left: 50px;
    justify-content: center
}

.formTitle{
    width:min-content; 
    text-align:center;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>