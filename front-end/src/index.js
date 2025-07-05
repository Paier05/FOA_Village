import React from 'react';
import "./index.css"
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/authPages/loginPage.js';
import OGHomePage from './pages/ogPages/ogHomePage.js';
import OGResourcesPage from './pages/ogPages/ogResourcesPage.js';
import OGTradePage from './pages/ogPages/ogTradePage.js';

import ModeratorHomePage from './pages/modPages/modHomePage.js';
import NPCHomePage from './pages/npcPages/npcHomePage.js';
import AdminHomePage from './pages/adminPages/adminHomePage.js';

import DashboardLayout from './sidebars/dashboardLayout.js';
import OGSidebar from './sidebars/ogSidebar.js';
import NPCViewInfoPage from './pages/npcPages/npcViewInfoPage.js';
import NPCGrantEffectPage from './pages/npcPages/npcGrantEffectPage.js';
import NPCUseEffectPage from './pages/npcPages/npcUseEffectPage.js';
import NPCDevelopLandPage from './pages/npcPages/npcDevelopLandPage.js';
import NPCBattleOutcomePage from './pages/npcPages/npcBattleOutcomePage.js';
import NPCTrainArmyPage from './pages/npcPages/npcTrainArmyPage.js';
import NPCSidebar from './sidebars/npcSidebar.js';
import AdminSidebar from './sidebars/adminSidebar.js';
import AdminAccountsPage from './pages/adminPages/adminAccountPage.js';
import ModeratorPrizePage from './pages/modPages/modPrizePage.js';
import ModSidebar from './sidebars/modSidebar.js';
import NPCUseSwordInStonePage from './pages/npcPages/npcUseSwordInStonePage.js';
import AdminAddEffectPage from './pages/adminPages/adminAddEffectPage.js';
import AdminUseEffectPage from './pages/adminPages/adminUseEffectPage.js';
import AdminSetArmyPage from './pages/adminPages/adminSetArmyPage.js';
import AdminSetLandPage from './pages/adminPages/adminSetLandPage.js';
import AdminSetFreelandPage from './pages/adminPages/adminSetFreelandPage.js';
import AdminSetResourcesPage from './pages/adminPages/adminSetResPage.js';
import AdminSetEffectsConstraintsPage from './pages/adminPages/adminSetConstraintsPage.js';
import AdminTimerPage from './pages/adminPages/adminTimerPage.js';
import AdminEventPage from './pages/adminPages/adminEventPage.js';
import NPCGoldExchangePage from './pages/npcPages/npcGoldExchangePage.js';
import AdminGoldExchangePage from './pages/adminPages/adminGoldExchangePage.js';
import NPCSetMarketPage from './pages/npcPages/npcSetMarketPage.js';
import AdminSetMarketPage from './pages/adminPages/adminSetMarketPage.js';
import OGGameRulesPage from './pages/ogPages/ogGameRulesPage.js';
import AdminRegisterPage from './pages/adminPages/adminRegisterPage.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/og/*"
        element={
          <DashboardLayout Sidebar={OGSidebar}>
            <Routes>
              <Route path="home" element={<OGHomePage />} />
              <Route path="resources" element={<OGResourcesPage />} />
              <Route path="trade" element={<OGTradePage />} />
              <Route path="gamerule" element={<OGGameRulesPage />} />
            </Routes>
          </DashboardLayout>
        }
      />

      <Route
        path="/mod/*"
        element={
          <DashboardLayout Sidebar={ModSidebar}>
            <Routes>
              <Route path="home" element={<ModeratorHomePage />} />
              <Route path="prize" element={<ModeratorPrizePage />} />
            </Routes>
          </DashboardLayout>
        }
      />

      <Route
        path="/npc/*"
        element={
          <DashboardLayout Sidebar={NPCSidebar}>
            <Routes>
              <Route path="home" element={<NPCHomePage />} />
              <Route path="oginfo" element={<NPCViewInfoPage />} />
              <Route path="granteff" element={<NPCGrantEffectPage />} />
              <Route path="useeff" element={<NPCUseEffectPage />} />
              <Route path="usesis" element={<NPCUseSwordInStonePage />} />
              <Route path="devland" element={<NPCDevelopLandPage />} />
              <Route path="battleoc" element={<NPCBattleOutcomePage />} />
              <Route path="trainarmy" element={<NPCTrainArmyPage />} />
              <Route path="goldexchg" element={<NPCGoldExchangePage />} />
              <Route path="marketrate" element={<NPCSetMarketPage />} />
            </Routes>
          </DashboardLayout>
        }
      />

      <Route
        path="/admin/*"
        element={
          <DashboardLayout Sidebar={AdminSidebar}>
            <Routes>
              <Route path="home" element={<AdminHomePage />} />
              <Route path="register" element={<AdminRegisterPage />} />
              <Route path="accounts" element={<AdminAccountsPage />} />
              <Route path="useeff" element={<AdminUseEffectPage />} />
              <Route path="gamephase" element={<AdminTimerPage />} />
              <Route path="events" element={<AdminEventPage />} />
              <Route path="goldexchg" element={<AdminGoldExchangePage />} />
              <Route path="force/addeff" element={<AdminAddEffectPage />} />
              <Route path="force/setarmy" element={<AdminSetArmyPage />} />
              <Route path="force/setland" element={<AdminSetLandPage />} />
              <Route path="force/setfreeland" element={<AdminSetFreelandPage />} />
              <Route path="force/setogres" element={<AdminSetResourcesPage />} />
              <Route path="force/effcons" element={<AdminSetEffectsConstraintsPage />} />
              <Route path="marketrate" element={<AdminSetMarketPage />} />
            </Routes>
          </DashboardLayout>
        }
      />

    </Routes>
  </BrowserRouter>
);