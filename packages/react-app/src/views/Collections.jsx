/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "@ethersproject/units";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Avatar } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Address, Balance } from "../components";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { useContractReader, useEventListener } from "../hooks";
import StackGrid from "react-stack-grid";
import Blockies from "react-blockies";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams
} from "react-router-dom";
const { Meta } = Card;

export default function Collections({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  targetNetwork,
}) {

  const blockExplorer = targetNetwork.blockExplorer;

  let poolsCount = useContractReader(readContracts, "Collections", "poolsCount", null, 1000);
  console.log(poolsCount);
  const numberPoolsCount = poolsCount && poolsCount.toNumber && poolsCount.toNumber();
  const [collections, setCollections] = useState();

  useEffect(() => {
    const updateCollections = async () => {
      const collectionsUpdate = [];
    
      for (let collectionIndex = 0; collectionIndex < numberPoolsCount; collectionIndex++) {
        try {
          const pool = await readContracts.Collections.pools(collectionIndex);
          const staked = await readContracts.Collections.balanceOf(address,collectionIndex);

          collectionsUpdate.push({ id: collectionIndex, artist: pool.artist, title: pool.title, staked: staked});
        
        } catch (e) {
          console.log(e);
        }
      }
      setCollections(collectionsUpdate);
    };
    updateCollections();
  }, [numberPoolsCount]);

  let galleryList = []

  for(let i in collections){
    galleryList.push(
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <h3>Staked: {formatEther(collections[i].staked)}</h3>,
          <Link to={{
            pathname: "/collection/" + i,
            state: {
              collectionTitle: collections[i].title,
            }
            }}>
            <Button type="primary">View Collection</Button>
          </Link>,
        ]}
      >
        <Meta
          avatar={<Blockies seed={collections[i].artist.toLowerCase()} size={8} scale={3} />}
          title={collections[i].artist}
          description={collections[i].title}
        />
      </Card>
    )
  }

  const [newPurpose, setNewPurpose] = useState("loading...");

  return (
    <div>
      <div style={{ width: 996, margin: "auto", marginTop: 32, paddingBottom: 32, marginBottom:32 }}>
      <h2>Number of Collections: {numberPoolsCount}</h2>
        <StackGrid
            columnWidth={300}
            gutterWidth={16}
            gutterHeight={16}
        >
         {galleryList} 
        </StackGrid>
      </div>
    </div>
  );
}
