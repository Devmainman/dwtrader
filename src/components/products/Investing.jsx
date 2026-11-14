import { useState } from 'react';
import { PieChart } from 'lucide-react';
import { portfolioApi } from '../../api/products';
import { Page, Tabs, useLoader } from './ui';
import { StocksPanel } from './Stocks';
import { RealEstateSection } from './RealEstate';

/** Investing: one page, two tabs — Stocks and Real Estate. Each tab shows its own figures. */
export default function Investing() {
  const summary = useLoader(() => portfolioApi.summary(), []);
  const features = summary.data?.features || {};
  const tabs = [
    ...(features.stocks !== false ? [{ value: 'stocks', label: 'Stocks' }] : []),
    ...(features.realEstate !== false ? [{ value: 'realEstate', label: 'Real Estate' }] : [])
  ];
  const [tab, setTab] = useState('stocks');
  const active = tabs.some((t) => t.value === tab) ? tab : tabs[0]?.value;

  return (
    <Page title="Investing" subtitle="Build a portfolio of stocks and real estate." icon={PieChart}>
      {tabs.length > 0 && <Tabs value={active} onChange={setTab} tabs={tabs} />}
      {active === 'stocks' && <StocksPanel />}
      {active === 'realEstate' && <RealEstateSection />}
      <p className="text-xs text-neutral-500 mt-6">Investments carry risk. Values can go down as well as up.</p>
    </Page>
  );
}
