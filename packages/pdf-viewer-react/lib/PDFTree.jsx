import { useState } from "react"

export default function PDFTree({
  treeData = [],
  nodeKey = 'key',
  level = 0,
  onNodeClick,
  style
}) {
  const [expandKeys, setExpandKeys] = useState([]);
  function expandNode(node) {
    const key = node[nodeKey];
    const index = expandKeys.indexOf(key);
    if (index === -1) {
      setExpandKeys([...expandKeys, key])
    } else {
      setExpandKeys([...expandKeys.slice(0, index), ...expandKeys.slice(index + 1)])
    }
  }
  function clickHandler(e, node) {
    onNodeClick(node);
    e.stopPropagation();
  }
  return (
    <div 
      className="pdf-tree-wrapper"
      style={style}
    > 
      <ul>
        {
          treeData.map(node => {
            return <li
              key={node[nodeKey]}
              className="pdf-tree-item"
            >
              <div 
                className="pdf-tree-item-main"
                onClick={(e) => clickHandler(e, node)}  
              >
                {
                  Boolean(node.items.length) 
                  && <i 
                    className="icon iconfont icon-expand pdf-item-icon" 
                    style={{ transform: `rotate(${expandKeys.includes(node[nodeKey]) ? '0deg' : '-90deg'})` }}
                    onClick={() => expandNode(node)}
                  ></i>
                }
                <span className="pdf-item-text" title={node.title}>{ node.title }</span>
              </div>
              { 
                Boolean(node.items?.length) 
                && expandKeys.includes(node[nodeKey]) 
                &&  <PDFTree
                  treeData={node.items}
                  nodeKey={nodeKey}
                  level={level + 1}
                  onNodeClick={(_node) => onNodeClick(_node)}
                ></PDFTree>
              }
            </li>
          })
        }
      </ul>
    </div>
  )
}