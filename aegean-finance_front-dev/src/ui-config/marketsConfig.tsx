import { ChainId } from '@aave/contract-helpers';
import {
  AaveV2Ethereum,
  AaveV2EthereumAMM,
  AaveV2Fuji,
  AaveV2Goerli,
  AaveV2Mumbai,
  AaveV2Polygon,
} from '@bgd-labs/aave-address-book';
import { ReactNode } from 'react';

// Enable for premissioned market
// import { PermissionView } from 'src/components/transactions/FlowCommons/PermissionView';
export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  // the network the market operates on
  chainId: ChainId;
  enabledFeatures?: {
    liquiditySwap?: boolean;
    staking?: boolean;
    governance?: boolean;
    faucet?: boolean;
    collateralRepay?: boolean;
    incentives?: boolean;
    permissions?: boolean;
    debtSwitch?: boolean;
    withdrawAndSwitch?: boolean;
    switch?: boolean;
  };
  isFork?: boolean;
  permissionComponent?: ReactNode;
  disableCharts?: boolean;
  subgraphUrl?: string;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    DEBT_SWITCH_ADAPTER?: string;
    WITHDRAW_SWITCH_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    L2_ENCODER?: string;
    UI_POOL_DATA_PROVIDER: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
    COLLECTOR?: string;
    V3_MIGRATOR?: string;
    GHO_TOKEN_ADDRESS?: string;
    GHO_UI_DATA_PROVIDER?: string;
  };
  /**
   * https://www.hal.xyz/ has integrated aave for healtfactor warning notification
   * the integration doesn't follow aave market naming & only supports a subset of markets.
   * When a halIntegration is specified a link to hal will be displayed on the ui.
   */
  halIntegration?: {
    URL: string;
    marketName: string;
  };
};
export enum CustomMarket {
  // v3 test networks, all v3.0.1
  // proto_arbitrum_goerli_v3 = 'proto_arbitrum_goerli_v3',
  // proto_mumbai_v3 = 'proto_mumbai_v3',
  // proto_fantom_testnet_v3 = 'proto_fantom_testnet_v3',
  // proto_fuji_v3 = 'proto_fuji_v3',
  // proto_optimism_goerli_v3 = 'proto_optimism_goerli_v3',
  // proto_scroll_sepolia_v3 = 'proto_scroll_sepolia_v3',
  // proto_sepolia_v3 = 'proto_sepolia_v3',
  // v3 mainnets
  // proto_mainnet_v3 = 'proto_mainnet_v3',
  // proto_optimism_v3 = 'proto_optimism_v3',
  // proto_fantom_v3 = 'proto_fantom_v3',
  // proto_harmony_v3 = 'proto_harmony_v3',
  // proto_avalanche_v3 = 'proto_avalanche_v3',
  // proto_polygon_v3 = 'proto_polygon_v3',
  // proto_arbitrum_v3 = 'proto_arbitrum_v3',
  // proto_metis_v3 = 'proto_metis_v3',
  // proto_base_v3 = 'proto_base_v3',
  // proto_gnosis_v3 = 'proto_gnosis_v3',
  // v2
  proto_mainnet = 'proto_mainnet',
  proto_avalanche = 'proto_avalanche',
  proto_fuji = 'proto_fuji',
  proto_polygon = 'proto_polygon',
  proto_mumbai = 'proto_mumbai',
  amm_mainnet = 'amm_mainnet',
  proto_goerli = 'proto_goerli',
  // external
  // permissioned_market = 'permissioned_market',
}

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  // [CustomMarket.proto_mainnet_v3]: {
  //   marketTitle: 'Ethereum',
  //   chainId: ChainId.mainnet,
  //   v3: true,
  //   enabledFeatures: {
  //     governance: true,
  //     staking: true,
  //     liquiditySwap: true,
  //     collateralRepay: true,
  //     incentives: true,
  //     withdrawAndSwitch: true,
  //     debtSwitch: true,
  //     switch: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Ethereum.POOL,
  //     WETH_GATEWAY: AaveV3Ethereum.WETH_GATEWAY,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Ethereum.REPAY_WITH_COLLATERAL_ADAPTER,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Ethereum.SWAP_COLLATERAL_ADAPTER,
  //     WALLET_BALANCE_PROVIDER: AaveV3Ethereum.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Ethereum.COLLECTOR,
  //     GHO_TOKEN_ADDRESS: AaveV3Ethereum.GHO_TOKEN,
  //     GHO_UI_DATA_PROVIDER: AaveV3Ethereum.UI_GHO_DATA_PROVIDER,
  //     WITHDRAW_SWITCH_ADAPTER: AaveV3Ethereum.WITHDRAW_SWAP_ADAPTER,
  //     DEBT_SWITCH_ADAPTER: AaveV3Ethereum.DEBT_SWAP_ADAPTER,
  //   },
  //   halIntegration: {
  //     URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
  //     marketName: 'aavev3',
  //   },
  // },
  [CustomMarket.proto_fuji]: {
    marketTitle: 'Avalanche Fuji',
    chainId: ChainId.fuji,
    enabledFeatures: {
      faucet: true,
      incentives: true,
    },
    subgraphUrl: 'https://api.studio.thegraph.com/query/52799/forward-finance/v0.0.5',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x4443D2D14c5Fe0CF0FC1e9dD0a352618b6397bF1',
      LENDING_POOL: '0xbcE31b00F9C99A76CD6Aee8A0416D2efaFCeCB8C',
      WETH_GATEWAY: '0x85d430557A8eFfC348331188ff53d939c8C5a09A',
      FAUCET: AaveV2Fuji.FAUCET,
      WALLET_BALANCE_PROVIDER: '0x0CCD53F7c39302043912B4142Ca7698540A07472',
      UI_POOL_DATA_PROVIDER: '0x09dE0CC264984840C3c0DE77532d5E5Bfe57618f',
      UI_INCENTIVE_DATA_PROVIDER: '0x6ce2BD4979D938dE6D655017117F301de1d195ac',
    },
  },
  [CustomMarket.proto_avalanche]: {
    marketTitle: 'Avalanche',
    chainId: ChainId.avalanche,
    enabledFeatures: {
      liquiditySwap: true,
      incentives: true,
      collateralRepay: true,
      debtSwitch: true,
      switch: true,
    },
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2-avalanche',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        '0x1336EeA64D6A6B8085191308968087dea143AfED' ||
        process.env.NEXT_PUBLIC_AVALANCHE_LENDING_POOL_ADDRESS_PROVIDER ||
        '',
      LENDING_POOL:
        '0x88B42e50Bc061AfBcF221bAeBcbBeD8EDdC29A9F' ||
        process.env.NEXT_PUBLIC_AVALANCHE_LENDING_POOL ||
        '',
      WETH_GATEWAY:
        '0x6E0137825B06e5E983439E76Fc6b4c5A40359A4b' ||
        process.env.NEXT_PUBLIC_AVALANCHE_WETH_GATEWAY ||
        '',
      SWAP_COLLATERAL_ADAPTER: process.env.NEXT_PUBLIC_AVALANCHE_SWAP_COLLATERAL_ADAPTER || '',
      REPAY_WITH_COLLATERAL_ADAPTER:
        process.env.NEXT_PUBLIC_AVALANCHE_REPAY_WITH_COLLATERAL_ADAPTER,
      WALLET_BALANCE_PROVIDER:
        '0x625C861fC7A5C75eBc3E7F273B66b94A76F078C9' ||
        process.env.NEXT_PUBLIC_AVALANCHE_WALLET_BALANCE_PROVIDER ||
        '',
      UI_POOL_DATA_PROVIDER:
        '0x3C04eFaED53ab8b35eD8D58F075cdCb0D22603Db' ||
        process.env.NEXT_PUBLIC_AVALANCHE_UI_POOL_DATA_PROVIDER ||
        '',
      UI_INCENTIVE_DATA_PROVIDER:
        '0xdD738b624280eEFf742471e0F22D32dB1c3bd07a' ||
        process.env.NEXT_PUBLIC_AVALANCHE_UI_INCENTIVE_DATA_PROVIDER ||
        '',
      COLLECTOR: process.env.NEXT_PUBLIC_AVALANCHE_COLLECTOR,
      V3_MIGRATOR: process.env.NEXT_PUBLIC_AVALANCHE_V3_MIGRATOR,
      DEBT_SWITCH_ADAPTER: process.env.NEXT_PUBLIC_AVALANCHE_DEBT_SWITCH_ADAPTER,
    },
    halIntegration: {
      URL: 'https://app.hal.xyz/recipes/aave-track-your-health-factor',
      marketName: 'aaveavalanche',
    },
  },
  [CustomMarket.proto_mumbai]: {
    marketTitle: 'Polygon Mumbai',
    chainId: ChainId.mumbai,
    enabledFeatures: {
      incentives: true,
      faucet: true,
    },
    subgraphUrl: 'https://api.studio.thegraph.com/query/52799/forward-finance/v0.0.3',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xe9A6a7D461e84AdAEA1b71a9Ada24F6AE837C3cD',
      LENDING_POOL: '0x8e0c68F5C0cc294F0E5889A80328F00dcf4E6A39',
      WETH_GATEWAY: '0x190Cb1e24f623ba8C758370d71Fb12468dFd0F2C',
      FAUCET: AaveV2Mumbai.FAUCET,
      WALLET_BALANCE_PROVIDER: '0x8131C849104fb351387F248F881B8431e402bec8',
      UI_POOL_DATA_PROVIDER: '0xD475C285853c1542eB8B7da04b4DDdC74a136075',
      UI_INCENTIVE_DATA_PROVIDER: '0xA2b7E33525c3CADf7F3e463D057984d33a76c7d7',
    },
  },
  [CustomMarket.proto_polygon]: {
    marketTitle: 'Polygon',
    chainId: ChainId.polygon,
    enabledFeatures: {
      liquiditySwap: true,
      incentives: true,
      collateralRepay: true,
      debtSwitch: true,
    },
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV2Polygon.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV2Polygon.POOL,
      WETH_GATEWAY: AaveV2Polygon.WETH_GATEWAY,
      SWAP_COLLATERAL_ADAPTER: AaveV2Polygon.SWAP_COLLATERAL_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER: AaveV2Polygon.REPAY_WITH_COLLATERAL_ADAPTER,
      WALLET_BALANCE_PROVIDER: AaveV2Polygon.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV2Polygon.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV2Polygon.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: AaveV2Polygon.COLLECTOR,
      V3_MIGRATOR: AaveV2Polygon.MIGRATION_HELPER,
      DEBT_SWITCH_ADAPTER: AaveV2Polygon.DEBT_SWAP_ADAPTER,
    },
    halIntegration: {
      URL: 'https://app.hal.xyz/recipes/aave-track-your-health-factor',
      marketName: 'aavepolygon',
    },
  },
  [CustomMarket.proto_mainnet]: {
    marketTitle: 'Ethereum',
    chainId: ChainId.mainnet,
    enabledFeatures: {
      governance: true,
      staking: true,
      liquiditySwap: true,
      collateralRepay: true,
      incentives: true,
      debtSwitch: true,
      switch: true,
    },
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV2Ethereum.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV2Ethereum.POOL,
      WETH_GATEWAY: AaveV2Ethereum.WETH_GATEWAY,
      REPAY_WITH_COLLATERAL_ADAPTER: AaveV2Ethereum.REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER: AaveV2Ethereum.SWAP_COLLATERAL_ADAPTER,
      WALLET_BALANCE_PROVIDER: AaveV2Ethereum.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV2Ethereum.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV2Ethereum.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: AaveV2Ethereum.COLLECTOR,
      V3_MIGRATOR: AaveV2Ethereum.MIGRATION_HELPER,
      DEBT_SWITCH_ADAPTER: AaveV2Ethereum.DEBT_SWAP_ADAPTER,
    },
    halIntegration: {
      URL: 'https://app.hal.xyz/recipes/aave-track-your-health-factor',
      marketName: 'aavev2',
    },
  },
  // [CustomMarket.permissioned_market]: {
  //   marketTitle: 'Ethereum Permissioned Market example',
  //   chainId: ChainId.mainnet,
  //   enabledFeatures: {
  //     // liquiditySwap: true,
  //     // collateralRepay: true,
  //     // incentives: true,
  //     permissions: true,
  //   },
  //   permissionComponent: <PermissionView />,
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: markets..POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: markets..POOL,
  //     WETH_GATEWAY: markets..WETH_GATEWAY,
  //     // REPAY_WITH_COLLATERAL_ADAPTER: markets..REPAY_WITH_COLLATERAL_ADAPTER,
  //     // SWAP_COLLATERAL_ADAPTER: markets..SWAP_COLLATERAL_ADAPTER,
  //     WALLET_BALANCE_PROVIDER: markets..WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: markets..UI_POOL_DATA_PROVIDER,
  //     // UI_INCENTIVE_DATA_PROVIDER: markets..UI_INCENTIVE_DATA_PROVIDER,
  //     PERMISSION_MANAGER: '<address here>',
  //   },
  // },
  [CustomMarket.amm_mainnet]: {
    marketTitle: 'Ethereum AMM',
    chainId: ChainId.mainnet,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV2EthereumAMM.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV2EthereumAMM.POOL,
      WETH_GATEWAY: AaveV2EthereumAMM.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: AaveV2EthereumAMM.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV2EthereumAMM.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV2EthereumAMM.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: AaveV2EthereumAMM.COLLECTOR,
      V3_MIGRATOR: AaveV2EthereumAMM.MIGRATION_HELPER,
    },
  },
  // v3
  // [CustomMarket.proto_sepolia_v3]: {
  //   marketTitle: 'Ethereum Sepolia',
  //   v3: true,
  //   chainId: ChainId.sepolia,
  //   enabledFeatures: {
  //     faucet: true,
  //   },
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Sepolia.POOL,
  //     WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY,
  //     FAUCET: AaveV3Sepolia.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3Sepolia.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Sepolia.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Sepolia.UI_INCENTIVE_DATA_PROVIDER,
  //   },
  // },
  // [CustomMarket.proto_base_v3]: {
  //   marketTitle: 'Base',
  //   v3: true,
  //   chainId: ChainId.base,
  //   enabledFeatures: {
  //     incentives: true,
  //     liquiditySwap: true,
  //     withdrawAndSwitch: true,
  //     collateralRepay: true,
  //     debtSwitch: true,
  //     switch: true,
  //   },
  // TODO: Need subgraph, currently not supported
  // subgraphUrl: '',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Base.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Base.POOL,
  //     WETH_GATEWAY: AaveV3Base.WETH_GATEWAY,
  //     WALLET_BALANCE_PROVIDER: AaveV3Base.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Base.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Base.UI_INCENTIVE_DATA_PROVIDER,
  //     L2_ENCODER: AaveV3Base.L2_ENCODER,
  //     COLLECTOR: AaveV3Base.COLLECTOR,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Base.REPAY_WITH_COLLATERAL_ADAPTER,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Base.SWAP_COLLATERAL_ADAPTER,
  //     // WALLET_BALANCE_PROVIDER: AaveV2Ethereum.WALLET_BALANCE_PROVIDER,
  //     WITHDRAW_SWITCH_ADAPTER: AaveV3Base.WITHDRAW_SWAP_ADAPTER,
  //     DEBT_SWITCH_ADAPTER: AaveV3Base.DEBT_SWAP_ADAPTER,
  //   },
  // },

  // [CustomMarket.proto_arbitrum_v3]: {
  //   marketTitle: 'Arbitrum',
  //   v3: true,
  //   chainId: ChainId.arbitrum_one,
  //   enabledFeatures: {
  //     incentives: true,
  //     liquiditySwap: true,
  //     collateralRepay: true,
  //     debtSwitch: true,
  //     withdrawAndSwitch: true,
  //     switch: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-arbitrum',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Arbitrum.POOL,
  //     WETH_GATEWAY: AaveV3Arbitrum.WETH_GATEWAY,
  //     WALLET_BALANCE_PROVIDER: AaveV3Arbitrum.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Arbitrum.UI_INCENTIVE_DATA_PROVIDER,
  //     L2_ENCODER: AaveV3Arbitrum.L2_ENCODER,
  //     COLLECTOR: AaveV3Arbitrum.COLLECTOR,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Arbitrum.SWAP_COLLATERAL_ADAPTER,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Arbitrum.REPAY_WITH_COLLATERAL_ADAPTER,
  //     DEBT_SWITCH_ADAPTER: AaveV3Arbitrum.DEBT_SWAP_ADAPTER,
  //     WITHDRAW_SWITCH_ADAPTER: AaveV3Arbitrum.WITHDRAW_SWAP_ADAPTER,
  //   },
  //   halIntegration: {
  //     URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
  //     marketName: 'arbitrum',
  //   },
  // },
  // [CustomMarket.proto_arbitrum_goerli_v3]: {
  //   marketTitle: 'Arbitrum Görli',
  //   v3: true,
  //   chainId: ChainId.arbitrum_goerli,
  //   enabledFeatures: {
  //     faucet: true,
  //     incentives: true,
  //   },
  //   //subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-arbitrum-goerli',  needs re-deployment
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3ArbitrumGoerli.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3ArbitrumGoerli.POOL,
  //     WETH_GATEWAY: AaveV3ArbitrumGoerli.WETH_GATEWAY,
  //     FAUCET: AaveV3ArbitrumGoerli.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3ArbitrumGoerli.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3ArbitrumGoerli.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3ArbitrumGoerli.UI_INCENTIVE_DATA_PROVIDER,
  //     L2_ENCODER: AaveV3ArbitrumGoerli.L2_ENCODER,
  //   },
  // },
  // [CustomMarket.proto_avalanche_v3]: {
  //   marketTitle: 'Avalanche',
  //   v3: true,
  //   chainId: ChainId.avalanche,
  //   enabledFeatures: {
  //     liquiditySwap: true,
  //     incentives: true,
  //     collateralRepay: true,
  //     debtSwitch: true,
  //     withdrawAndSwitch: true,
  //     switch: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-avalanche',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Avalanche.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Avalanche.POOL,
  //     WETH_GATEWAY: AaveV3Avalanche.WETH_GATEWAY,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Avalanche.REPAY_WITH_COLLATERAL_ADAPTER,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Avalanche.SWAP_COLLATERAL_ADAPTER,
  //     WALLET_BALANCE_PROVIDER: AaveV3Avalanche.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Avalanche.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Avalanche.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Avalanche.COLLECTOR,
  //     DEBT_SWITCH_ADAPTER: AaveV3Avalanche.DEBT_SWAP_ADAPTER,
  //     WITHDRAW_SWITCH_ADAPTER: AaveV3Avalanche.WITHDRAW_SWAP_ADAPTER,
  //   },
  //   halIntegration: {
  //     URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
  //     marketName: 'avalanche',
  //   },
  // },
  // [CustomMarket.proto_fuji_v3]: {
  //   marketTitle: 'Avalanche Fuji',
  //   v3: true,
  //   chainId: ChainId.fuji,
  //   enabledFeatures: {
  //     faucet: true,
  //     incentives: true,
  //   },
  //   //  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-fuji',  needs re-deployment
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Fuji.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Fuji.POOL,
  //     WETH_GATEWAY: AaveV3Fuji.WETH_GATEWAY,
  //     FAUCET: AaveV3Fuji.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3Fuji.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Fuji.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Fuji.UI_INCENTIVE_DATA_PROVIDER,
  //   },
  // },
  // [CustomMarket.proto_optimism_goerli_v3]: {
  //   marketTitle: 'Optimism Görli',
  //   v3: true,
  //   chainId: ChainId.optimism_goerli,
  //   enabledFeatures: {
  //     faucet: true,
  //     incentives: true,
  //   },
  //   // subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-optimism-goerli',  needs re-deployment
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3OptimismGoerli.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3OptimismGoerli.POOL,
  //     WETH_GATEWAY: AaveV3OptimismGoerli.WETH_GATEWAY,
  //     FAUCET: AaveV3OptimismGoerli.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3OptimismGoerli.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3OptimismGoerli.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3OptimismGoerli.UI_INCENTIVE_DATA_PROVIDER,
  //     L2_ENCODER: AaveV3OptimismGoerli.L2_ENCODER,
  //   },
  // },
  // [CustomMarket.proto_scroll_sepolia_v3]: {
  //   marketTitle: 'Scroll Sepolia',
  //   v3: true,
  //   chainId: ChainId.scroll_sepolia,
  //   enabledFeatures: {
  //     faucet: true,
  //     incentives: true,
  //   },
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3ScrollSepolia.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3ScrollSepolia.POOL,
  //     WETH_GATEWAY: AaveV3ScrollSepolia.WETH_GATEWAY,
  //     FAUCET: AaveV3ScrollSepolia.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3ScrollSepolia.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3ScrollSepolia.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3ScrollSepolia.UI_INCENTIVE_DATA_PROVIDER,
  //     L2_ENCODER: AaveV3ScrollSepolia.L2_ENCODER,
  //   },
  // },
  // [CustomMarket.proto_fantom_v3]: {
  //   marketTitle: 'Fantom',
  //   v3: true,
  //   chainId: ChainId.fantom,
  //   enabledFeatures: {
  //     incentives: true,
  //     collateralRepay: true,
  //     liquiditySwap: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-fantom',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Fantom.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Fantom.POOL,
  //     WETH_GATEWAY: AaveV3Fantom.WETH_GATEWAY,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Fantom.SWAP_COLLATERAL_ADAPTER,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Fantom.REPAY_WITH_COLLATERAL_ADAPTER,
  //     WALLET_BALANCE_PROVIDER: AaveV3Fantom.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Fantom.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Fantom.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Fantom.COLLECTOR,
  //   },
  //   halIntegration: {
  //     URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
  //     marketName: 'fantom',
  //   },
  // },
  // [CustomMarket.proto_fantom_testnet_v3]: {
  //   marketTitle: 'Fantom Testnet',
  //   v3: true,
  //   chainId: ChainId.fantom_testnet,
  //   enabledFeatures: {
  //     faucet: true,
  //     incentives: true,
  //   },
  //   // subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-fantom-testnet',  needs re-deployment
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3FantomTestnet.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3FantomTestnet.POOL,
  //     WETH_GATEWAY: AaveV3FantomTestnet.WETH_GATEWAY,
  //     FAUCET: AaveV3FantomTestnet.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3FantomTestnet.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3FantomTestnet.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3FantomTestnet.UI_INCENTIVE_DATA_PROVIDER,
  //   },
  // },
  // [CustomMarket.proto_harmony_v3]: {
  //   marketTitle: 'Harmony',
  //   v3: true,
  //   chainId: ChainId.harmony,
  //   enabledFeatures: {
  //     incentives: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-harmony',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Harmony.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Harmony.POOL,
  //     WETH_GATEWAY: AaveV3Harmony.WETH_GATEWAY,
  //     WALLET_BALANCE_PROVIDER: AaveV3Harmony.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Harmony.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Harmony.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Harmony.COLLECTOR,
  //   },
  // },
  // [CustomMarket.proto_optimism_v3]: {
  //   marketTitle: 'Optimism',
  //   v3: true,
  //   chainId: ChainId.optimism,
  //   enabledFeatures: {
  //     incentives: true,
  //     collateralRepay: true,
  //     liquiditySwap: true,
  //     debtSwitch: true,
  //     withdrawAndSwitch: true,
  //     switch: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-optimism',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Optimism.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Optimism.POOL,
  //     WETH_GATEWAY: AaveV3Optimism.WETH_GATEWAY,
  //     WALLET_BALANCE_PROVIDER: AaveV3Optimism.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Optimism.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Optimism.UI_INCENTIVE_DATA_PROVIDER,
  //     L2_ENCODER: AaveV3Optimism.L2_ENCODER,
  //     COLLECTOR: AaveV3Optimism.COLLECTOR,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Optimism.SWAP_COLLATERAL_ADAPTER,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Optimism.REPAY_WITH_COLLATERAL_ADAPTER,
  //     DEBT_SWITCH_ADAPTER: AaveV3Optimism.DEBT_SWAP_ADAPTER,
  //     WITHDRAW_SWITCH_ADAPTER: AaveV3Optimism.WITHDRAW_SWAP_ADAPTER,
  //   },
  // },
  // [CustomMarket.proto_polygon_v3]: {
  //   marketTitle: 'Polygon',
  //   chainId: ChainId.polygon,
  //   v3: true,
  //   enabledFeatures: {
  //     liquiditySwap: true,
  //     incentives: true,
  //     collateralRepay: true,
  //     debtSwitch: true,
  //     withdrawAndSwitch: true,
  //     switch: true,
  //   },
  //   subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Polygon.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Polygon.POOL,
  //     WETH_GATEWAY: AaveV3Polygon.WETH_GATEWAY,
  //     REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Polygon.REPAY_WITH_COLLATERAL_ADAPTER,
  //     SWAP_COLLATERAL_ADAPTER: AaveV3Polygon.SWAP_COLLATERAL_ADAPTER,
  //     WALLET_BALANCE_PROVIDER: AaveV3Polygon.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Polygon.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Polygon.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Polygon.COLLECTOR,
  //     DEBT_SWITCH_ADAPTER: AaveV3Polygon.DEBT_SWAP_ADAPTER,
  //     WITHDRAW_SWITCH_ADAPTER: AaveV3Polygon.WITHDRAW_SWAP_ADAPTER,
  //   },
  //   halIntegration: {
  //     URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
  //     marketName: 'polygon',
  //   },
  // },
  // [CustomMarket.proto_mumbai_v3]: {
  //   marketTitle: 'Polygon Mumbai',
  //   chainId: ChainId.mumbai,
  //   enabledFeatures: {
  //     incentives: true,
  //     faucet: true,
  //   },
  //   //  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-mumbai',  needs re-deployment
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Mumbai.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Mumbai.POOL,
  //     WETH_GATEWAY: AaveV3Mumbai.WETH_GATEWAY,
  //     FAUCET: AaveV3Mumbai.FAUCET,
  //     WALLET_BALANCE_PROVIDER: AaveV3Mumbai.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Mumbai.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Mumbai.UI_INCENTIVE_DATA_PROVIDER,
  //   },
  //   v3: true,
  // },
  [CustomMarket.proto_goerli]: {
    marketTitle: 'Ethereum Görli',
    chainId: ChainId.goerli,
    enabledFeatures: {
      faucet: true,
    },
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2-goerli',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV2Goerli.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV2Goerli.POOL,
      WETH_GATEWAY: AaveV2Goerli.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: AaveV2Goerli.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV2Goerli.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV2Goerli.UI_INCENTIVE_DATA_PROVIDER,
      FAUCET: AaveV2Goerli.FAUCET,
    },
  },
  // [CustomMarket.proto_metis_v3]: {
  //   marketTitle: 'Metis',
  //   chainId: ChainId.metis_andromeda,
  //   v3: true,
  //   enabledFeatures: {
  //     incentives: true,
  //   },
  //   subgraphUrl: 'https://andromeda.thegraph.metis.io/subgraphs/name/aave/protocol-v3-metis',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Metis.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Metis.POOL,
  //     WETH_GATEWAY: '0x0', // not applicable for Metis
  //     WALLET_BALANCE_PROVIDER: AaveV3Metis.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Metis.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Metis.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Metis.COLLECTOR,
  //   },
  //   halIntegration: {
  //     URL: 'https://app.hal.xyz/recipes/aave-v3-track-health-factor',
  //     marketName: 'polygon',
  //   },
  // },
  // [CustomMarket.proto_gnosis_v3]: {
  //   marketTitle: 'Gnosis',
  //   chainId: ChainId.xdai,
  //   v3: true,
  //   // subgraphUrl: '',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: AaveV3Gnosis.POOL_ADDRESSES_PROVIDER,
  //     LENDING_POOL: AaveV3Gnosis.POOL,
  //     WETH_GATEWAY: AaveV3Gnosis.WETH_GATEWAY,
  //     WALLET_BALANCE_PROVIDER: AaveV3Gnosis.WALLET_BALANCE_PROVIDER,
  //     UI_POOL_DATA_PROVIDER: AaveV3Gnosis.UI_POOL_DATA_PROVIDER,
  //     UI_INCENTIVE_DATA_PROVIDER: AaveV3Gnosis.UI_INCENTIVE_DATA_PROVIDER,
  //     COLLECTOR: AaveV3Gnosis.COLLECTOR,
  //   },
  // },
} as const;
