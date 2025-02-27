// d3.schemeCategory10
const colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];

window.addEventListener('DOMContentLoaded', async () => {
    const graph = new graphology.Graph();
    const {nodes, links} = await (await fetch('miserables.json')).json();
    nodes.forEach(node => {
        graph.addNode(node.id, node);
    });
    links.forEach(link => {
        graph.addEdge(link.source, link.target, link);
    });

    // layout
    graph.forEachNode(node => {
        graph.setNodeAttribute(node, 'x', Math.random());
        graph.setNodeAttribute(node, 'y', Math.random());
    });
    const positions = await (await fetch('miserables-positions.json')).json();
    graph.forEachNode(node => {
        const position = positions[node];
        graph.setNodeAttribute(node, 'x', position.x);
        graph.setNodeAttribute(node, 'y', position.y);
    });

    const style = {
        node: {
            size: 15,
            color: node => colors[(node.group || 0) % colors.length],
            border: {
                width: 2,
                color: '#ffffff',
            },
            icon: {
                content: 'person',
                fontFamily: 'Material Icons',
                fontSize: 20,
                color: '#ffffff',
            },
            label: {
                content: node => node.id,
                type: PixiGraph.TextType.BITMAP_TEXT,
                fontFamily: 'HelveticaRegular',
                fontSize: 12,
                color: '#333333',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: 4,
            },
        },
        edge: {
            width: link => Math.log((link.value || 0) + 1) + 1,
            color: '#cccccc',
        },
    };
    const hoverStyle = {
        node: {
            border: {
                color: '#000000',
            },
            label: {
                backgroundColor: 'rgba(238, 238, 238, 1)',
            },
        },
        edge: {
            color: '#999999',
        },
    };

    const resources = [
        {
            name: 'HelveticaRegular',
            url: 'https://gist.githubusercontent.com/zakjan/b61c0a26d297edf0c09a066712680f37/raw/8cdda3c21ba3668c3dd022efac6d7f740c9f1e18/HelveticaRegular.fnt'
        },
    ];
    await new FontFaceObserver('Material Icons').load();

    const pixiGraph = new PixiGraph.PixiGraph({
        container: document.getElementById('graph'),
        graph,
        style,
        hoverStyle,
        resources,
    });
    pixiGraph.on('nodeClick', (event, nodeKey) => console.log('nodeClick', event, nodeKey));
    pixiGraph.on('nodeMousemove', (event, nodeKey) => console.log('nodeMousemove', event, nodeKey));
    pixiGraph.on('nodeMouseover', (event, nodeKey) => console.log('nodeMouseover', event, nodeKey));
    pixiGraph.on('nodeMouseout', (event, nodeKey) => console.log('nodeMouseout', event, nodeKey));
    pixiGraph.on('nodeMousedown', (event, nodeKey) => console.log('nodeMousedown', event, nodeKey));
    pixiGraph.on('nodeMouseup', (event, nodeKey) => console.log('nodeMouseup', event, nodeKey));
    pixiGraph.on('edgeClick', (event, edgeKey) => console.log('edgeClick', event, edgeKey));
    pixiGraph.on('edgeMousemove', (event, edgeKey) => console.log('edgeMousemove', event, edgeKey));
    pixiGraph.on('edgeMouseover', (event, edgeKey) => console.log('edgeMouseover', event, edgeKey));
    pixiGraph.on('edgeMouseout', (event, edgeKey) => console.log('edgeMouseout', event, edgeKey));
    pixiGraph.on('edgeMousedown', (event, edgeKey) => console.log('edgeMousedown', event, edgeKey));
    pixiGraph.on('edgeMouseup', (event, edgeKey) => console.log('edgeMouseup', event, edgeKey));

    const minX = graph.nodes().reduce((acc, node) => Math.min(acc, graph.getNodeAttribute(node, 'x')), Infinity);
    const maxX = graph.nodes().reduce((acc, node) => Math.max(acc, graph.getNodeAttribute(node, 'x')), -Infinity);
    const minY = graph.nodes().reduce((acc, node) => Math.min(acc, graph.getNodeAttribute(node, 'y')), Infinity);
    const maxY = graph.nodes().reduce((acc, node) => Math.max(acc, graph.getNodeAttribute(node, 'y')), -Infinity);

    const addNode = () => {
        const id = Math.floor(Math.random() * 10e12).toString(36);
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        const node = {id, x, y};

        graph.addNode(node.id, node);
    };
    document.getElementById('add-node').addEventListener('click', addNode);

    const addEdge = () => {
        const nodeKeys = graph.nodes();
        let source, target;
        do {
            source = nodeKeys[Math.floor((nodeKeys.length - 1) * Math.random())];
            target = nodeKeys[Math.floor((nodeKeys.length - 1) * Math.random())];
        } while (graph.edge(source, target));
        const link = {source, target};

        graph.addEdge(link.source, link.target);
    };
    document.getElementById('add-edge').addEventListener('click', addEdge);

    const dropNode = () => {
        const nodeKeys = graph.nodes();
        const nodeKey = nodeKeys[Math.floor((nodeKeys.length - 1) * Math.random())];

        graph.dropNode(nodeKey);
    };
    document.getElementById('drop-node').addEventListener('click', dropNode);

    const dropEdge = () => {
        const edgeKeys = graph.edges();
        const edgeKey = edgeKeys[Math.floor((edgeKeys.length - 1) * Math.random())];

        graph.dropEdge(edgeKey);
    };
    document.getElementById('drop-edge').addEventListener('click', dropEdge);

    const clear = () => {
        graph.clear();
    };
    document.getElementById('clear').addEventListener('click', clear);

    const clearEdges = () => {
        graph.clearEdges();
    };
    document.getElementById('clear-edges').addEventListener('click', clearEdges);

    const zoomIn = () => {
        pixiGraph.zoomIn();
    };
    document.getElementById('zoom-in').addEventListener('click', zoomIn);

    const zoomOut = () => {
        pixiGraph.zoomOut();
    };
    document.getElementById('zoom-out').addEventListener('click', zoomOut);

    const updateNode = () => {
        const nodeKeys = graph.nodes();
        const nodeKey = nodeKeys[Math.floor((nodeKeys.length - 1) * Math.random())];
        const group = graph.getNodeAttribute(nodeKey, 'group');

        graph.setNodeAttribute(nodeKey, 'group', (group + 1) % colors.length);
    };
    document.getElementById('update-node').addEventListener('click', updateNode);

    const updateEdge = () => {
        const edgeKeys = graph.edges();
        const edgeKey = edgeKeys[Math.floor((edgeKeys.length - 1) * Math.random())];
        const value = graph.getEdgeAttribute(edgeKey, 'value');

        graph.setEdgeAttribute(edgeKey, 'value', value * 50);
    };
    document.getElementById('update-edge').addEventListener('click', updateEdge);

    const updateNodes = () => {
        graph.updateEachNodeAttributes((nodeKey, nodeAttributes) => {
            return {
                ...nodeAttributes,
                group: (nodeAttributes.group + 1) % colors.length
            };
        });
    };
    document.getElementById('update-nodes').addEventListener('click', updateNodes);

    const updateEdges = () => {
        graph.updateEachEdgeAttributes((edgeKey, edgeAttributes) => {
            return {
                ...edgeAttributes,
                value: edgeAttributes.value * 50
            };
        });
    };
    document.getElementById('update-edges').addEventListener('click', updateEdges);

    const resetView = () => {
        pixiGraph.resetView();
    };
    document.getElementById('reset-view').addEventListener('click', resetView);

    let serializedGraph;
    const exportGraph = () => {
        serializedGraph = graph.export();
        console.log(serializedGraph);
    };
    document.getElementById('export').addEventListener('click', exportGraph);

    const importGraph = () => {
        graph.import(serializedGraph);
    };
    document.getElementById('import').addEventListener('click', importGraph);
});