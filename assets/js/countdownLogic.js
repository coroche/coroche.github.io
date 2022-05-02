const solutions=[] //List to store solutions as they're found

function solve_list(num_list,target,ops) {
    
    if (num_list.includes(target)){ //if the target is in the number list add it to solutions
        solutions.push([target.toString()+' = '+target.toString()])
    }
    
    //Loop through all pairs in the numbers list
    const pairs = getPairs(num_list);
    pairs.forEach(function(pair) { 
        
        others=[...num_list];
        others.splice(others.indexOf(pair[0]),1);
        others.splice(others.indexOf(pair[1]),1); //List of remaining numbers not in pair

        //Addition
        res=pair[0]+pair[1]
        new_ops=ops.concat(pair[0].toString()+' + '+pair[1].toString()+' = '+res.toString()) //List of operations (equation strings) performed so far 
        if (res==target){
            //if the result of the operation equals the target write the operations to the solutions list
            solutions.push(new_ops);
        } else {
            //if not, create a new list with the result and remaining numbers and recurse
            new_list=[res].concat(others)
            solve_list(new_list,target,new_ops)
        }

        others=[...num_list];
        others.splice(others.indexOf(pair[0]),1);
        others.splice(others.indexOf(pair[1]),1); //List of remaining numbers not in pair

        //Multiplication
        if (pair[0] != 1 && pair[1] !=1 ) { //Optimisation, redundant to multiply by one
            res=pair[0]*pair[1]
            new_ops=ops.concat(pair[0].toString()+' × '+pair[1].toString()+' = '+res.toString())
            if (res==target){
                solutions.push(new_ops)
            } else {
                new_list=[res].concat(others)
                solve_list(new_list,target,new_ops)
            }
        }

        others=[...num_list];
        others.splice(others.indexOf(pair[0]),1);
        others.splice(others.indexOf(pair[1]),1); //List of remaining numbers not in pair

        //Subtraction
        //The operation that doesn't result in a negative number is chosen
        res=Math.abs(pair[0]-pair[1])
        if (pair[0]>pair[1]) {
            new_ops=ops.concat(pair[0].toString()+' - '+pair[1].toString()+' = '+res.toString())
        } else {
            new_ops=ops.concat(pair[1].toString()+' - '+pair[0].toString()+' = '+res.toString())
        }

        if (res==target) {
            solutions.push(new_ops)	
        } else {
            new_list=[res].concat(others)
            solve_list(new_list,target,new_ops)
        }

        others=[...num_list];
        others.splice(others.indexOf(pair[0]),1);
        others.splice(others.indexOf(pair[1]),1); //List of remaining numbers not in pair

        //Division a/b
        if (![0,1].includes(pair[1])) { //Cannot divide by 0, redundant to divide by 1
            res=pair[0]/pair[1]
            if (res%1==0 && res!=pair[1]) { //Check that the result of the operation is an integer (required by rules), check if a/b=b (redundant)
               // res=int(res)
                new_ops=ops.concat(pair[0].toString()+' ÷ '+pair[1].toString()+' = '+res.toString())
                if (res==target) {
                    solutions.push(new_ops)
                } else {
                    new_list=[res].concat(others)
                    solve_list(new_list,target,new_ops)
                }
            }
        }

        others=[...num_list];
        others.splice(others.indexOf(pair[0]),1);
        others.splice(others.indexOf(pair[1]),1); //List of remaining numbers not in pair

        //Division b/a
        if (![0,1].includes(pair[0])) {
            res=pair[1]/pair[0]
            if (res%1==0 && res!=pair[0]) {
                //res=int(res)
                new_ops=ops.concat(pair[1].toString()+' ÷ '+pair[0].toString()+' = '+res.toString())		
                if (res==target) {
                    solutions.push(new_ops)
                } else {
                    new_list=[res].concat(others)
                    solve_list(new_list,target,new_ops)
                }
            }
        }
    
    })
}


function solveBoard(tiles, target) {  
    
    solutions.splice(0,solutions.length);
    solve_list(tiles,target,[])
    
    if (solutions.length == 0) {
        return ['No solution exists :(']
    } else {
        solutions.sort(function(a,b){
            return a.length - b.length;
        });
        return solutions[0]
    }
}

function getPairs(array) {

    function p(t, i) {
        if (t.length === 2) {
            result.push(t);
            return;
        }
        if (i + 1 > array.length) {
            return;
        }
        p(t.concat(array[i]), i + 1);
        p(t, i + 1);
    }

    var result = [];
    p([], 0);
    return result;
}