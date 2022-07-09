// BABA IS Y'ALL SOLVER - BLANK TEMPLATE
// Version 1.0
// Code by Milk 


//get imports (NODEJS)
var simjs = require('../js/simulation')					//access the game states and simulation

let possActions = ["space", "right", "up", "left", "down"];



class Stack {

	constructor()
	{
		this.stack = [];
	}

	push(element)
	{
		this.stack.push(element);
		return this.stack; 
	}

	pop()
	{
		return this.stack.pop();
	}

	peek()
	{
		return this.stack[this.stack.length -1];
	}

	size()
	{
		return this.stack.length;
	}
}

const stateSet = new Set();
const stack = [];

class Node {
	constructor(m, a, p, w, d) {
	  this.mapRep = m;
	  this.actionHistory = a;
	  this.parent = p;
	  this.won = w;
	  this.died = d;
	}
  }


  function newState(kekeState, map) {
	simjs.clearLevel(kekeState);
	kekeState.orig_map = map;
	[kekeState.back_map, kekeState.obj_map] = simjs.splitMap(kekeState.orig_map);
	simjs.assignMapObjs(kekeState);
	simjs.interpretRules(kekeState);
  }


  function getChildNode(currState, action, parent) {
	// Append the child direction to the existing movement path.
	const nextActions = [];
	nextActions.push(...parent.actionHistory);
	nextActions.push(action);
  
	let won = false;
	let died = false;
	for (let a = 0, b = nextActions.length; a < b; a += 1) {
	  const nextMove = simjs.nextMove(nextActions[a], currState);
	  const nextState = nextMove.next_state;
	  won = nextMove.won;
	  if (nextState.players.length === 0) {
		won = false;
		died = true;
	  }
	}
  
	const childMap = simjs.doubleMap2Str(currState.obj_map, currState.back_map);
	const child = new Node(childMap, nextActions, parent, won, died);
	return child;
  }

  function getChildren(parent, map) {
	const children = [];
	for (let i = 0, j = possActions.length; i < j; i += 1) {
	  const currState = {};
	  newState(currState, map);
	  const childNode = getChildNode(currState, possActions[i], parent);
	  if (!stateSet.has(childNode.mapRep) && !childNode.died) children.push(childNode);
	}
	return children;
  }

  const aStar = function (grafo, heuristica, start, goal) {

    //contiene las distancias desde el nodo inicial a todos los nodos
    var distancias = [];
    for (var i = 0; i < grafo.length; i++) distancias[i] = Number.MAX_VALUE;
    //la distancia del nodo inicial a sí mismo es 0
    distancias[start] = 0;

    //conntiene las prioridades con los nodos visitados, una vez calculada la heuristica.
    var prioridades = [];
    //Inicializa con prioridad de infinito
    for (var i = 0; i < grafo.length; i++) priorities[i] = Number.MAX_VALUE;
    //el nodo inicial tiene un valor igual a  distancia en línea recta a la meta. Será el primero en ser ampliado.
    prioridades[start] = heuristica[start][goal];

    //contiene los nodos ya visitados
    var visitados = [];

    //será verdadero mientras queden nodos por visitar
    while (true) {

        // ... find the node with the currently lowest priority...
        var bajaPrioridad = Number.MAX_VALUE;
        var bajaPrioridadIndex = -1;
        for (var i = 0; i < prioridades.length; i++) {
            //... by going through all nodes that haven't been visited yet
            if (prioridades[i] < bajaPrioridad && !visitados[i]) {
                bajaPrioridad = prioridades[i];
                bajaPrioridadIndex = i;
            }
        }

        if (bajaPrioridadIndex === -1) {
            // No había ningún nodo no visitado --> Nodo no encontrado
            return -1;
        } else if (bajaPrioridadIndex === goal) {
            // console.log("Goal node found!");
            return distancias[bajaPrioridadIndex];
        }


        for (var i = 0; i < grafo[bajaPrioridadIndex].length; i++) {
            if (grafo[bajaPrioridadIndex][i] !== 0 && !visitados[i]) {
                //...if the path over this edge is shorter...
                if (distancias[bajaPrioridadIndex] + grafo[bajaPrioridadIndex][i] < distancias[i]) {
                    //guardar esta ruta como nueva ruta corta
                    distancias[i] = distancias[bajaPrioridadIndex] + grafo[bajaPrioridadIndex][i];
                    //...establece la prioridad con la que debemos continuar con este nodo
                    prioridades[i] = distancias[i] + heuristica[i][goal];
                }
            }
        }

        //por ultimo, note that we are finished with this node.
        visitados[bajaPrioridadIndex] = true;
    
    	}
	}
  
  // NEXT ITERATION STEP FOR SOLVING
  function iterSolve(initState) {
	// PERFORM ITERATIVE CALCULATIONS HERE //
	if (stack.length > 0) {
	  const parent = stack.shift();
	  const children = getChildren(parent, initState.orig_map);
	  for (let i = 0, j = children.length; i < j; i += 1) {
		stateSet.add(children[i].mapRep);
		if (children[i].won) return children[i].actionHistory;
	  }
	  stack.push(...children);
	}
	// return a sequence of actions or empty list
	return [];
  }


  
  function initStack(initState) {
	const parent = new Node(simjs.map2Str(initState.orig_map), [], null, false, false);
	stack.push(parent);
  }
  
  // VISIBLE FUNCTION FOR OTHER JS FILES (NODEJS)
  module.exports = {
	step(initState) { return iterSolve(initState); },
	init(initState) { initStack(initState); },
	best_sol() { return (stack.length > 1 ? stack.shift().actionHistory : []); },
  };








