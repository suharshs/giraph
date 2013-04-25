# giraph

Welcome to giraph.js a simple graph javascript library.
giraph allows you quickly create a new directed or undirected graph, perform provided or user defined algorithms on them, and finally visualize them!

## Resources
* [API Reference](https://github.com/suharshs/giraph/wiki/API-Reference)
* Interactive graph viewer

## Dependencies
* [Raphael](http://raphaeljs.org/) - A nice SVG manipulation javascript library used for visualizing the graphs.

## How to start
It's really simple to start building you own graphs.
First download and include giraph.js in your html:
```
<html>
 <head>
   ...
   <script type="text/javascript" src="raphaeljs.min.js"></script>
   <script type="text/javascript" src="giraph.js"></script>
   <script type="text/javascript" src="myfile.js"></script>
 </head>
...
```

How to make a simple triangle:
```
// myfile.js
var g = giraph.graph.graph(); // creates a new graph
g.add_vertex(1).add_vertex(2).add_vertex(3); // adds three vertices
g.add_edge(1,2).add_edge(2,3).add_edge(3,1); // adds three edges

```


Feel free to contact me at [suharshs@gmail.com](mailto:suharshs@gmail.com) for any ideas or contribution you would like to make to giraph.

giraph is available under the [MIT License](https://github.com/suharshs/giraph/blob/master/LICENSE).