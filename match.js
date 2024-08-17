const board_height = 8;
const board_width = 8;
const colours = 5;
const empty_colour = 6;
const animation_length = 0.15;

var board = Array.from({ length: board_height }, () => Array(board_width).fill(0));

var html_board;
var selected = false;
var mouse;
var drop = [];
var ready = true;
var wait_ready = false;
var is_animating = false;
var longest = 0;
var to_deploy_vertical = [];
var to_deploy_horizontal = [];

function draw_board(){
    var text = "";
    var img;
    var top;
    var left;
    for (var y = 0;y<board_height;y++){
        for (var x = 0;x<board_width;x++){
            if (board[y][x]!=empty_colour){
                top = (30*y).toString();
                left = (30*x).toString();
                img = get_img_src(board[y][x])

                text += '<img src = '+img+' style = ";top:'+top+'px;left:'+left+'px;width:30px;height:30px;position:absolute;"></img>';
            }
        }
    }
    if (selected == false){
        mouse.style.opacity = "0"
    } else {
        mouse.style.top = (selected[0]*30+10).toString() + "px"
        mouse.style.left = (selected[1]*30+10).toString() + "px"
        mouse.style.opacity = "100"
    }
    
    html_board.innerHTML = text;
}

function get_img_src(value){
    if (value == 5){
        return "moon.png"
    } else if (value == 1){
        return "leaf.png"
    } else if (value == 2){
        return "fire.png"
    } else if (value == 3){
        return "water.png"
    } else if (value == 4){
        return "star.png"
    } else if (value == 41){
        return "star_horizontal_stripes.png"
    } else if (value == 42){
        return "star_vertical_stripes.png"
    } else if (value == 31){
        return "water_horizontal_stripes.png"
    } else if (value == 32){
        return "water_vertical_stripes.png"
    } else if (value == 21){
        return "fire_horizontal_stripes.png"
    } else if (value == 22){
        return "fire_vertical_stripes.png"
    } else if (value == 11){
        return "leaf_horizontal_stripes.png"
    } else if (value == 12){
        return "leaf_vertical_stripes.png"
    } else if (value == 51){
        return "moon_horizontal_stripes.png"
    } else if (value == 52){
        return "moon_vertical_stripes.png"
    } else if (value == 8){
        return "lightning.png"// lighning bomb
    } else if (value == 7){
        return "cookie.png"
    } else {
        return "blank.png"
    }
    

}

function smash(y,x){
    console.log("smash")
    colour = board[y][x]
    if (colour>=0&&colour<=4){
        board[y][x] = empty_colour
    } else if (colour ==7){
        deploy_five(Math.floor(Math.random()*5))  
        board[y][x] = empty_colour
    } else if (colour == 8){
        deploy_lightning(y,x)
        board[y][x] = empty_colour
    } else if ((colour).toString().length == 2){
        
        deploy([colour,y,x])
    }
    board[y][x] = empty_colour
}

function fill_board(){
    for (var y = 0;y<board_height;y++){
        for (var x = 0; x<board_width;x++){
            board[y][x] = Math.floor(Math.random()*(colours))+1
        }
    }
}

function check(y,x) {
    longest = 0
    to_deploy_horizontal = [];
    to_deploy_vertical = [];
    var vertical = check_y(y,x)
    var horizontal = check_x(y,x)
    if (vertical == false && horizontal == false){
        return false
    } else if (vertical == false){
        if (to_deploy_horizontal){
            for (var name = 0;name < to_deploy_horizontal.length;name ++){
                deploy(to_deploy_horizontal[name])
            }
        }
        return horizontal
    } else if (horizontal == false){
        if (to_deploy_vertical){
            for (var name = 0;name < to_deploy_vertical.length;name ++){
                deploy(to_deploy_vertical[name])
            }
        }
        return vertical
    } else {
        if (horizontal.length >vertical.length){
            longest = 2
        } else {
            longest = 1
        }
        for (var i = 1; i<horizontal.length; i++){
            vertical.push(horizontal[i])
        }
        for (var k = 0; k<to_deploy_horizontal;k++){
            deploy(to_deploy_horizontal[k])
        }
        for (var l = 0; l<to_deploy_vertical;l++){
            deploy(to_deploy_vertical[l])
        }
        return vertical
    }
}

function deploy(variable){
    //do stuff
    var colour = variable[0]
    var y = variable[1]
    var x = variable[2]
    board[y,x] = empty_colour;

    if (colour % 2!=0){//vertical

        for (var yy = 0;yy<10;yy++){
            smash(y,yy)
            
        }
    } else {//horizontal
        for (var xx = 0; xx<10;xx++){
            smash(xx,x)
            
        }
    }
    
}

function deploy_five(colour){
    for (var i = 0; i<board_height;i++){
        for (var j = 0; j<board_width;j++){
            if (board[i][j] == colour){
                board[i][j] = empty_colour;
            }
        }
    }
}

function deploy_stripy_cookie(colour){
    base_colour = Math.floor(colour/10)
    for (var i = 0; i<board_height;i++){
        for (var j = 0; j<board_width;j++){
            if (board[i][j] == base_colour){
                var second_num = Math.floor((Math.random()*2)+1)
                num = parseInt((base_colour).toString()+(second_num).toString(),10);
                board[i][j] = num
                console.log(num)
            }
        }
    }
}
    
function double_stripy(y,x){
    for (var i = 0;i<board_height;i++){
        
        smash(i,x)
    }
    for (var j = 0;j<board_width;j++){
        smash(y,j)
        
    }
}

function deploy_double_five(){
    console.log("double_five")
    for (var i = 0; i<board_height;i++){
        for (var j = 0; j<board_width;j++){
            board[i][j] = empty_colour;
        }
    }
}

function deploy_lightning(y,x){
    board[y][x]=empty_colour;
    for (var i = -1;i<=1;i++){
        if (y+i>=0&&y+i<10){
            for (var j=-1;j<=1;j++){
                if (x+j>=0&&x+j<10){
                    smash(y+i,x+j)
                }
            }
        }
    }
    check_whole_board();
}

function check_x(y,x){
    
    var colour = board[y][x];
    
    if (colour>10){
        to_deploy_horizontal.push([colour,y,x])
        colour = Math.floor(colour/10)
    }
    var piece = [[y,x]];
    for (var left = x-1; left >=0&&(board[y][left]==colour||(board[y][left] > 10 && colour==Math.floor(board[y][left]/10))) ;left--){
        piece.push([y,left]);
            
        if (board[y][left] > 10 &&Math.floor(board[y][left]/10)==colour){
            to_deploy_horizontal.push([board[y][left],y,left])
            board[y][left]=empty_colour;
            
        }
    }
    for (var right = x+1; right < board_width&&(board[y][right]==colour||(board[y][right] > 10 &&colour ==Math.floor(board[y][right]/10))) ;right++){
        
        piece.push([y,right]);
        if (board[y][right] > 10 &&Math.floor(board[y][right]/10)==colour){
            to_deploy_horizontal.push([board[y][right],y,right])
            board[y][right]=empty_colour;
        }
    }
    
    if (piece.length<3){
        return false
    } else {
        return piece
    }
}

function check_y(y,x){
    var colour = board[y][x];
    if (colour > 10){
        to_deploy_vertical.push([colour,y,x])
        colour = Math.floor(colour/10)
    }
    var piece = [[y,x]];
    for (var up = y-1; up >=0&&(board[up][x]==colour||(board[up][x] > 10 && Math.floor(board[up][x]/10)==colour)) ;up--){

        piece.push([up,x]);
        if (board[up][x] > 10 && Math.floor(board[up][x]/10)==colour){
            to_deploy_vertical.push([board[up][x],up,x])
            board[up][x]=empty_colour;
            
        }
    }
    for (var down = y+1; down < board_height && (board[down][x]==colour||(board[down][x] > 10 && Math.floor(board[down][x]/10)== colour));down++){
        piece.push([down,x]);
        if (board[down][x] > 10 &&Math.floor(board[down][x]/10)==colour){
            to_deploy_vertical.push([board[down][x],down,x])
            board[down][x] = empty_colour;
        }
    }
    
   
    
    if (piece.length<3){
        return false
    } else {
        return piece
    }
}

function filled(){

    if (ready){
        return true
    } else {
        return false
    }
}

function board_filled(){
    for (var y = 0;y<board_height;y++){
        for (var x = 0; x<board_width ; x++){
            if (board[y][x] == empty_colour){
                return false
            }
        }
    }
    return true
}

function drop_animation(drop){
    is_animating = true
    date = new Date().getTime();
    var time = 0;
    var good = true;
    var constant_text = ""
    var text = ""
    
    for (var y = 0; y<board_height;y++){
        for (var x = 0;x<board_width;x++){
            
            good = true
            if (board[y][x]==empty_colour){
                good = false
            }
            for (var i = 0; i<drop.length && good == true;i++){
                if ((y==drop[i][0]&&x==drop[i][1])){
                    good = false
                }
            }
            
            if (good){
                var top = (30*y).toString();
                var left = (30*x).toString();
                var colour = get_img_src(board[y][x])
                constant_text += '<img src = '+colour+' style = "top:'+top+'px;left:'+left+'px;width:30px;height:30px;position:absolute;"></div>';
            }
        }
    }

    
    function animateStep() {
        
        time = (new Date().getTime() - date)/1000;
        text = "" + constant_text
        for (var j = 0; j<drop.length;j++){
            var left = (30*drop[j][1]).toString();
            var top = (30*(drop[j][0]-1+(time)/animation_length)).toString();
            text += '<img src = '+get_img_src(board[drop[j][0]][drop[j][1]])+' style = "top:'+top+'px;left:'+left+'px;width:30px;height:30px;position:absolute;"></img>';
        }
        html_board.innerHTML = text
        if (time < animation_length) {
            
            requestAnimationFrame(animateStep);
        } else {
            
            is_animating = false
            draw_board()
        }
    }
    
    animateStep();
    draw_board();
}

function check_whole_board(){
    var pieces = []
    for (var y = 0; y<board_height;y++){
        for (var x = 0; x<board_width;x++){
            var piece = check(y,x)
            if (!(piece == false)){
                for (var i = 0; i<piece.length;i++){
                    pieces.push([piece[i][0],piece[i][1]])
                    //do some stuff to a score or smth
                }
            }
        }
    }
    if (pieces){
        return pieces
          
    } else {
        return false
    }
}

function check_board(){
    if (filled()){
        var piecess = check_whole_board()
        if (!piecess==false){
            for (var i = 0; i < piecess.length;i++){
                board[piecess[i][0]][piecess[i][1]]=empty_colour;
            }
            
        }
    }
    draw_board();
}

function swap(y1,x1,y2,x2){
    if (filled()){
        var piece_1 = board[y1][x1]
        var piece_2 = board[y2][x2]
        board[y1][x1]=piece_2
        board[y2][x2]=piece_1
        if (piece_1 == 7 && piece_2 == 7){
            deploy_double_five();
            return true
        }
        if (piece_1 == 7 || piece_2 == 7){
            
            if ((piece_1).toString().length==2){
                var colour = board[y1][x1]
                board[y1][x1] = empty_colour
                board[y2][x2] = empty_colour
                deploy_stripy_cookie(colour);
                
                
                
            } else if ((piece_2).toString().length==2){
                var colour = board[y2][x2]
                board[y1][x1] = empty_colour
                board[y2][x2] = empty_colour
                deploy_stripy_cookie(colour);
                
            } else if (piece_1 == 7){
                var colour = board[y1][x1]
                board[y1][x1] = empty_colour
                board[y2][x2] = empty_colour
                deploy_five(colour);
                
            } else if (piece_2 == 7){
                var colour = board[y2][x2]
                board[y1][x1] = empty_colour
                board[y2][x2] = empty_colour
                deploy_five(colour);
                
                
            }
            return true
        }
        
        if ((piece_1).toString().length==2 && ((piece_2).toString().length==2)){
            board[y1][x1] = empty_colour
            board[y2][x2] = empty_colour
            double_stripy(y2,x2);
            return true
        }
        
        move_1 = check(y1,x1)
        var longest_1 = longest
        move_2 = check(y2,x2)
        var longest_2 = longest
        draw_board()
        var dir;
        if (y1 == y2){
            dir = 1
        } else {
            dir = 2
        }


        if (move_1==false && move_2==false){
            board[y1][x1]=piece_1
            board[y2][x2]=piece_2
            return false
        } else {
            check_board();
            if (move_1){
                for (var i = 0;i<move_1.length;i++){
                    if (board[move_1[i][0]][move_1[i][1]]){
                        board[move_1[i][0]][move_1[i][1]]=empty_colour;
                    }
                }
                if (move_1.length ==4){
                    if (dir == 1){
                        board[y1][x1] = parseInt(((piece_2).toString()+"1"),10)
                    } else {
                        board[y1][x1] = parseInt(((piece_2).toString()+"2"),10)
                    }


                } else if (move_1.length == 5){
                    var x_one = move_1[0][0]
                    var x_one_count = 0
                    var y_one = move_1[0][1]
                    var y_one_count = 0
                    if (dir == 2){
                        for (var j = 0;j<5&&move_1[j][0]==x_one;j++){
                            x_one_count += 1;
                        }
                    
                        if (x_one_count == 5){
                            board[y1][x1] = 7
                        }
                    } else {
                        for (j = 0;j<5&&move_1[j][1]==y_one;j++){
                            y_one_count += 1;
                        }
                        if (y_one_count == 5){
                            board[y1][x1]=7
                        }
                    }
                    if (x_one_count<5&&y_one_count<5){
                        board[y1][x1] = 8;
                    }
                } else if (move_1.length >5){
                    board[y1][x1]=7
                }
            }
            if (move_2){
                for (var i = 0;i<move_2.length;i++){
                    if (board[move_2[i][0]][move_2[i][1]]){
                        board[move_2[i][0]][move_2[i][1]]=empty_colour;
                    }
                }
                if (move_2.length ==4){
                    if (dir == 1){
                        board[y2][x2] = parseInt(((piece_1).toString()+"1"),10)
                    } else {
                        board[y2][x2] = parseInt(((piece_1).toString()+"2"),10)
                    }

                } else if (move_2.length == 5){
                    var x_two = move_2[0][0]
                    var x_two_count = 0
                    var y_two = move_2[0][1]
                    var y_two_count = 0
                    if (dir == 2){
                        for (var j = 0;j<5&&move_2[j][0]==x_two;j++){
                            x_two_count += 1;
                        }
                        if (x_two_count == 5){
                            board[y2][x2] = 7
                        }
                    } else {
                        for (j = 0;j<5&&move_2[j][1]==y_two;j++){
                            y_two_count += 1;
                        }
                        if (y_two_count == 5){
                            board[y2][x2]=7
                        }
                    }
                    if (x_two_count<5&&y_two_count<5){
                        board[y2][x2] = 8;
                    }
                } else if (move_2.length>5){
                    board[y2][x2]=7
                }
            }
            draw_board()
            return true

        }
    }
    
}

function start_gravity(){
    var timer = setInterval(function(){
        innards();
        if (!board_filled()){
            ready = false
            
        } else {
            if (!is_animating){
                ready = true
            } else {
                ready = false
            }
            
            if (!wait_ready){
                wait_ready = true
            } else {
                ready = true
                is_animating = false
                wait_ready = false
            }
            
        }
        if (ready){
            check_board();
        }

    },animation_length*1000)
}

function innards(){
    
    draw_board()
    drop = []
    if (!filled()){
        for (var y = board_height-1;y>0;y--){
            for (var x = 0;x<board_width;x++){
                if (board[y][x]==empty_colour&&!(board[y-1][x] == empty_colour)){
                    board[y][x]=board[y-1][x];
                    board[y-1][x] = empty_colour;
                    drop.push([y,x])
                }
            }
        }
        for (var x = 0; x<board_width;x++){
            if (board[0][x]==empty_colour){
                board[0][x]=Math.floor(Math.random()*(colours))+1
                drop.push([0,x])
            }
        }
        if (drop){
            selected = false
            drop_animation(drop)


        }
    }
}

function on_click(event){
    const x = event.clientX;
    const y = event.clientY;
    const margin = 10
    var board_x = Math.floor((x-10)/30)
    var board_y = Math.floor((y-10)/30)
    if (board_x>=board_width || board_x <0 || board_y >=board_height || board_y<0){
        selected = false;
    } else {
        if ((Math.abs(selected[1]-board_x)==1&&Math.abs(selected[0]-board_y)==0)||(Math.abs(selected[1]-board_x)==0&&Math.abs(selected[0]-board_y)==1)){
            var swapped = swap(selected[0],selected[1],board_y,board_x)

            if (!swapped){
                selected = [board_y,board_x]
            }
            selected = false;
        } else{
            if (board[board_y][board_x]==8){
                deploy_lightning(board_y,board_x)
                selected = false;
            }
            if (selected[0]==board_y&&selected[1]==board_x){
                selected = false;
            } else {
                selected = [board_y,board_x]
            }
            
        }
    }
    draw_board()
}

document.addEventListener("DOMContentLoaded", function() {
    html_board = document.getElementById("board");
    html_board.style.width = (30*board_width).toString() + "px"
    html_board.style.height = (30*board_height).toString() + "px"
    mouse = document.getElementById("selected")
    fill_board();
    check_board();
    start_gravity()
    
});

window.addEventListener("mousedown",function(){
    on_click(event)
})
    
