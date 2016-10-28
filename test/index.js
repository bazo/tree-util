"use strict";

var should = require('chai').should();
var assert = require('chai').assert;
var tree_util = require('../index.js');
var builder = tree_util.builder;

var emptyObjectArray = [];
var emptyConfig = {};
var standardConfig =  { id : 'id', parentid : 'parentid'};
var singleTreeOneNodeObjArray = [{ id : 1 }];
var singleTreeTwoNodeObjArray = [{ id : 1 }, { id : 2, parentid : 1 }];
var singleTreeRoootTreeChildren = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 }, { id : 4, parentid : 1 }];

var complexSingleTreeData = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 }, { id : 4, parentid : 1 }];
complexSingleTreeData.push({ id : 5, parentid : 2 });
complexSingleTreeData.push({ id : 6, parentid : 2 });
complexSingleTreeData.push({ id : 7, parentid : 3 });
complexSingleTreeData.push({ id : 8, parentid : 4 });
complexSingleTreeData.push({ id : 9, parentid : 2 });
complexSingleTreeData.push({ id : 10, parentid : 6 });
complexSingleTreeData.push({ id : 11, parentid : 6 });

var moreTreeData = [{ id : 12 }, { id : 13, parentid : 12}];
var twoTreesData = complexSingleTreeData.concat(moreTreeData);

describe('#builder.buildTrees', function() {
  it('missing param objectArray should throw exception', function() {
    assert.throws(function() { builder.buildTrees() }, 'objectArray is mandatory');
  });

  it('missing param config should throw exception', function() {
    assert.throws(function() { builder.buildTrees(emptyObjectArray) }, 'config is mandatory');
  });

  it('config has not id property set, should throw exception', function() {
    assert.throws(function() { builder.buildTrees(emptyObjectArray, emptyConfig) }, 'config property id is not set');
  });

  it('config has not parentid property set, should throw exception', function() {
    assert.throws(function() { builder.buildTrees(emptyObjectArray, { id : 'id' }) }, 'config property parentid is not set');
  });

  it('empty input aray returns empty array of trees', function() {
    builder.buildTrees(emptyObjectArray, standardConfig).should.deep.equal([]);
  });

  it('aray with one object should return an array containing one tree', function() {
    builder.buildTrees(singleTreeOneNodeObjArray, standardConfig).length.should.equal(1);
  });

  it('aray with one root and one child node should return an array containing one tree', function() {
    builder.buildTrees(singleTreeTwoNodeObjArray, standardConfig).length.should.equal(1);
  });

  it('aray with one root and one child node should return one tree where root has one child node', function() {
    var trees = builder.buildTrees(singleTreeTwoNodeObjArray, standardConfig);
    var rootNode = trees[0].rootNode;
    rootNode.children.length.should.equal(1);
  });

  it('aray with one root and one child node should return one tree where single child node has root as parent', function(){
    var trees = builder.buildTrees(singleTreeTwoNodeObjArray, standardConfig);
    var parentNode = trees[0].rootNode;
    var childNode = parentNode.children[0];
    childNode.parent.should.deep.equal(parentNode);
  });

  it('aray with one root which has tree child nodee should return one tree where root has tree children', function(){
    var trees = builder.buildTrees(singleTreeRoootTreeChildren, standardConfig);
    var parentNode = trees[0].rootNode;
    parentNode.children.length.should.equal(3);
  });

  it('aray with one root which has tree child nodee should return one tree where each child as root as parent', function(){
    var trees = builder.buildTrees(singleTreeRoootTreeChildren, standardConfig);
    var parentNode = trees[0].rootNode;

    for (var i = 0; i < parentNode.children.length; i++) {
      var childNode = parentNode.children[i];
      childNode.parent.should.deep.equal(parentNode);
    }
  });

  it('aray with one root which has more complex structure should have the property parent set correct for all nodes', function(){
    let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
    //test
    trees.length.should.equal(1);

    var checkThatParentNodeIsSetCorrect = function(node) {
      for (var i = 0; i < node.children.length; i++) {
        let childNode = node.children[i];
        //test
        childNode.parent.should.deep.equal(node);
        checkThatParentNodeIsSetCorrect(childNode);
      }
    }

    let parentNode = trees[0].rootNode;
    checkThatParentNodeIsSetCorrect(parentNode);
  });


  it('aray with one root which has more complex structure should have child count for each node as expected', function(){
    let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
    //test
    trees.length.should.equal(1);
    var nodeWithChildrenCount = 0;
    var nodeCheckCount = 0;

    var checkChildCount = function(node) {
      //tests
      if(node.id === 1) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 2) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 3) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 4) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 5) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 6) {
        nodeCheckCount++;
        node.children.length.should.equal(2);
      } else if (node.id === 7) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 8) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 9) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 10) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 11) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      }

      if(node.children.length > 0) {
        nodeWithChildrenCount++;
      }

      for (var i = 0; i < node.children.length; i++) {
        let childNode = node.children[i];
        checkChildCount(childNode);
      }
    }

    let parentNode = trees[0].rootNode;
    checkChildCount(parentNode);

    //tests
    nodeWithChildrenCount.should.equal(5);
    nodeCheckCount.should.equal(complexSingleTreeData.length);
  });

  it('aray with two root which has more complex structure should have child count for each node as expected', function(){
    const treeToTest = twoTreesData;
    let trees = builder.buildTrees(treeToTest, standardConfig);
    //test
    trees.length.should.equal(2);
    var nodeWithChildrenCount = 0;
    var nodeCheckCount = 0;

    var checkChildCount = function(node) {
      //tests
      if(node.id === 1) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 2) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 3) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 4) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 5) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 6) {
        nodeCheckCount++;
        node.children.length.should.equal(2);
      } else if (node.id === 7) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 8) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 9) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 10) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 11) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 12) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 13) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      }

      if(node.children.length > 0) {
        nodeWithChildrenCount++;
      }

      for (var i = 0; i < node.children.length; i++) {
        let childNode = node.children[i];
        checkChildCount(childNode);
      }
    }

    for (var i = 0; i < trees.length; i++) {
      let rootNode = trees[i].rootNode;
      checkChildCount(rootNode);
    }

    //tests
    nodeWithChildrenCount.should.equal(6);
    nodeCheckCount.should.equal(treeToTest.length);
  });
});

var itemArray = [{ itemid : 1, referenceid : 4 }, { itemid : 2, referenceid : 5 }, { itemid : 3, referenceid : 1 },  { itemid : 4, referenceid : 1 }];
var objectArray = [{ objectid : 1, refid : 1 }, { objectid : 2, refid : 5 }];
var addDataConfig = { referenceid : 'referenceid', collectionname : 'items' };
var addDataConfigObjectArray = { referenceid : 'refid', collectionname : 'objects' };

describe('#tree.addData', function() {
  it('addData is called with mising objectArray param and exception is thrown', function() {
    let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    assert.throws(function() { tree.addData(undefined , addDataConfig) }, 'objectArray is mandatory');
  });

  it('addData is called with mising config param and exception is thrown', function() {
    let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    assert.throws(function() { tree.addData(itemArray, undefined) }, 'config is mandatory');
  });

  it('addData is called and data is added to the right nodes', function() {
    let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);

    for (var i = 0; i < itemArray.length; i++) {
      let item = itemArray[i];
      let node = tree.getNodeById(item.referenceid);
      let collectionLength = 0;

      if(item.referenceid === 4 || item.referenceid === 5) {
        collectionLength = 1;
      } else if (item.referenceid === 1) {
        collectionLength = 2;
      }

      //tests
      node[addDataConfig.collectionname].length.should.equal(collectionLength);

      if(item.referenceid === 4 || item.referenceid === 5) {
        node[addDataConfig.collectionname][0].should.deep.equal(item);
      } else if (item.referenceid === 1) {
        if(item.itemid === 3) {
          node[addDataConfig.collectionname][0].should.deep.equal(item);
        }
        if(item.itemid === 4) {
          node[addDataConfig.collectionname][1].should.deep.equal(item);
        }
      }
    }
  });

  describe('#tree.getSingleNodeData', function() {
    it('for the given node returns a collection with 2 items (they come from same collection)', function() {
      let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
      var tree = trees[0];
      tree.addData(itemArray, addDataConfig);
      var node = tree.getNodeById(1);
      node.getSingleNodeData().length.should.equal(2);
    });

    it('for given node returns a collection with 3 items (they come from two collections)', function() {
      let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
      var tree = trees[0];
      tree.addData(itemArray, addDataConfig);
      tree.addData(objectArray, addDataConfigObjectArray);
      var node = tree.getNodeById(1);
      node.getSingleNodeData().length.should.equal(3);
    });
  });

  describe('#tree.getRecursiveNodeData', function() {
    it('for the root node returns a collection with 6 items (they come from 4 different nodes)', function() {
      let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
      var tree = trees[0];
      tree.addData(itemArray, addDataConfig);
      tree.addData(objectArray, addDataConfigObjectArray);
      var node = tree.getNodeById(1);
      node.getRecursiveNodeData().length.should.equal(6);
    });

    it('for each leaf node in the tree getSingleNodeData and getRecursiveNodeData should return same data', function() {
      let trees = builder.buildTrees(complexSingleTreeData, standardConfig);
      var tree = trees[0];
      tree.addData(itemArray, addDataConfig);
      tree.addData(objectArray, addDataConfigObjectArray);

      var checkLeaveNodes = function(node) {
        if(node.children.length > 0) {
          for (var i = 0; i < node.children.length; i++) {
            checkLeaveNodes(node.children[i]);
          }
        } else {
          var dataFromGetSingleNodeData = node.getSingleNodeData();
          var dataFromGetRecursiveNodeData = node.getRecursiveNodeData();

          dataFromGetSingleNodeData.length.should.equal(dataFromGetRecursiveNodeData.length);

          for (var i = 0; i < dataFromGetSingleNodeData.length; i++) {
            var singleObj = dataFromGetSingleNodeData[i];
            var recursiveObj = dataFromGetSingleNodeData[i];

            singleObj.should.deep.equal(recursiveObj);
          }
        }
      }

      checkLeaveNodes(trees[0].rootNode);
    });
  });

});
