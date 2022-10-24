import React, { useState } from 'react';
import Header from 'next/head';
import Layout from '../components/layout';
import { FlexboxGrid, Input, InputGroup, InputNumber, Checkbox, Grid, Row, Col, Container } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';

const padding = {
  paddingLeft: '10px',
  paddingRight: '10px'
};
const center = {
  position: 'fixed',
  textAlign: 'center'
};

type Author = {
  key: string,
  name: string,
  works: Work[],
  topWork: string
}

type Work = {
  title: string,
  revision: number
};

const getAuthorData = async (authorName: string, numWorks: number): Promise<Author> => {
  const author: Author = {
    key: '',
    name: '',
    works: [],
    topWork: ''
  };
  //console.log('numWorks:', numWorks);
  const urlEncodedAuthorName = encodeURIComponent(authorName);
  const authors = await fetch(`https://openlibrary.org/search/authors.json?q=${urlEncodedAuthorName}`);
  const authorsData = await authors.json();

  //console.log(authorsData);
  if (authorsData.numFound && authorsData.numFound > 0) {
    author.key = authorsData.docs[0].key;
    author.name = authorsData.docs[0].name;
    author.topWork = authorsData.docs[0].top_work;
    //console.log(`top work for ${author.name}`, author.topWork);
    //console.log('works for author', author.name);

    const worksResponse = await fetch(`https://openlibrary.org/authors/${author.key}/works.json`);
    const worksData = await worksResponse.json();
    //console.log(worksData);
    author.works = worksData.entries;
  }
  return author;
};


const Home = () => {
  const [authorOne, setAuthorOne] = useState('');
  const [authorTwo, setAuthorTwo] = useState('');
  const [numberWorks, setNumberWorks] = useState(6);
  const authors: Author[] = [];

  const searchForAuthorOne = async (event: React.SyntheticEvent<Element, Event>): Promise<void> => {
    console.log('searching for author one', authorOne);
    authors[0] = await getAuthorData(authorOne, numberWorks);
    console.log(authors[0]);
  };

  const searchForAuthorTwo = async (event: React.SyntheticEvent<Element, Event>): Promise<void> => {
    console.log('searching for author two', authorTwo);
    authors[1] = await getAuthorData(authorTwo, numberWorks);
    console.log(authors[1]);
  };

  return (
    <>
      <Header>
        <title>HOME</title>
      </Header>
      <Layout activeKey="home">
        <h3>Author Revision Head to Head</h3>
      </Layout>
      <div className="show-grid">
        <FlexboxGrid justify='center'>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputGroup size="md">
              <Input placeholder={"Author One"} value={authorOne} onChange={setAuthorOne} onPressEnter={searchForAuthorOne} />
              <InputGroup.Button onClick={searchForAuthorOne}>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputGroup size="md">
              <Input placeholder={"Author Two"} value={authorTwo} onChange={setAuthorTwo} onPressEnter={searchForAuthorTwo} />
              <InputGroup.Button onClick={searchForAuthorTwo}>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <InputNumber size="md" defaultValue='6' prefix={<p>Number of Works</p>} onChange={setNumberWorks} />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={padding}>
            <Checkbox>Include Best Seller</Checkbox>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </>
  );
}

export default Home;
