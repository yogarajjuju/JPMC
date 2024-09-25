import React, { useEffect, useRef } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';

interface GraphProps {
  data: ServerRespond[],
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  const viewerRef = useRef<PerspectiveViewerElement>(null);

  useEffect(() => {
    if (viewerRef.current) {
      const elem = viewerRef.current;

      // Set Perspective attributes
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct count',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
      }));

      // Load data into the Perspective Viewer
      const table = (window as any).perspective.worker().table(data.map((el: any) => ({
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price,
        top_bid_price: el.top_bid && el.top_bid.price,
        timestamp: el.timestamp,
      })));

      elem.load(table);
    }
  }, [data]);

  return (
    <perspective-viewer ref={viewerRef}></perspective-viewer>
  );
}

export default Graph;
