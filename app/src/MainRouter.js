import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Menu from './core/Menu';
import Create from './room/Create';
import Room from './room/Room';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Routes>
        <Route exact path="/" element={ <Create /> }/>
        <Route path="/room/:roomKey" element={ <Room /> }/>
      </Routes>
    </div>
  );
};

export default MainRouter;
