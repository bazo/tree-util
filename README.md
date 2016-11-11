# tree-util
Simple but powerfull library for building and working with tree structures.

## Features

  * Building tree structures based on data with parent child relations by id
  * Methods for determining ancestor and descendant relations between nodes
  * Methods for adding data to and getting data from tree structures
  * General methods for working with trees
  * Heavily tested

Easy to build tree structures where the data items has a parent child relation through id properties.
An example of a data source with parent child relation can be a table in a relational database.

## Examples

Building the tree.

```js
var tree_util = require('tree-util')

// An array where the items has a parent child reference using id properties
var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
             { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

// Config object to set the id properties for the parent child relation
var standardConfig =  { id : 'id', parentid : 'parentid'};

// Creates an array of trees. For this example there will by only one tree
var trees = tree_util.buildTrees(items, standardConfig);
```

Determine ancestor or descendant relationships

```js
// Contiued from example above
var tree = trees[0];
var rootNode = tree.rootNode;
var leafNode = tree.getNodeById(5);

var isDescendant = leafNode.isDescendantOf(rootNode); //returns true
var isAncestor = rootNode.isAncestorOf(leafNode); //returns true
```

## API Reference

The methods in the API either belong to the tree_util, the tree or the node.

### tree_util

#### Methods
##### buildTrees
Builds a tree based on an object array and a config object which defines the id relation properties.
###### Usage
buildTrees(objectArray, config);
###### Arguments
<table>
  <thead>
    <tr>
      <td>
        <b>Param</b>
      </td>
      <td>
        <b>Type</b>
      </td>
      <td>
        <b>Details</b>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        objectArray
      </td>
      <td>
        Array
      </td>
      <td>
         An array of objects with ids which determines the parent child relation
      </td>
    </tr>
    <tr>
      <td>
        config
      </td>
      <td>
        object
      </td>
      <td>
          An object which defines the properties which defines the parent child relation for the data objects in the objectArray param. The object has following properties:
          <ul>
            <li><b>id</b> - Name of the id property (primary key)</li>
            <li><b>parentid</b> - Name of the property which reference the parent object (foreign key)</li>
          </ul>
      </td>
    </tr>
  </tbody>
</table>

### tree

#### Properties

<table>
  <thead>
    <tr>
      <td>
        <b>Name</b>
      </td>
      <td>
        <b>Type</b>
      </td>
      <td>
        <b>Details</b>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        rootNode
      </td>
      <td>
        Node object
      </td>
      <td>
        Root node for the tree
      </td>
    </tr>
  </tbody>
</table>
#### Methods

##### addData
Adds data to the nodes based on config object which defines the reference id.
###### Usage
addData(objectArray, config);
###### Arguments
<table>
  <thead>
    <tr>
      <td>
        <b>Param</b>
      </td>
      <td>
        <b>Type</b>
      </td>
      <td>
        <b>Details</b>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        objectArray
      </td>
      <td>
        Array
      </td>
      <td>
         An array of objects with ids which determines the node relation
      </td>
    </tr>
    <tr>
      <td>
        config
      </td>
      <td>
        object
      </td>
      <td>
          An object which defines the reference property and the collection name. The object has following properties:
          <ul>
            <li><b>referenceid</b> - Name of the referenceid property for the data object (reference primary id of node)</li>
            <li><b>collectionname</b> - Name of the property which will hold the array of data object on the node</li>
          </ul>
      </td>
    </tr>
  </tbody>
</table>

##### getNodeById
Gets the node in the tree based on id parameter.
###### Usage
getNodeById(id);
###### Arguments
<table>
  <thead>
    <tr>
      <td>
        <b>Param</b>
      </td>
      <td>
        <b>Type</b>
      </td>
      <td>
        <b>Details</b>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        id
      </td>
      <td>
        Anything
      </td>
      <td>
         Id value for node. Typically an integer(Number)
      </td>
    </tr>
  </tbody>
</table>

## License
(The MIT License)


Copyright (c) 2016 Kristian Marheim Abrahamsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
