import { task } from 'hardhat/config';
import {
  loadPoolConfig,
  ConfigNames,
  getTreasuryAddress,
  getWrappedNativeTokenAddress,
  getQuoteCurrency,
} from '../../helpers/configuration';
import { ZERO_ADDRESS } from '../../helpers/constants';
import {
  getAaveProtocolDataProvider,
  getAddressById,
  getLendingPool,
  getLendingPoolAddressesProvider,
  getLendingPoolAddressesProviderRegistry,
  getLendingPoolCollateralManager,
  getLendingPoolCollateralManagerImpl,
  getLendingPoolConfiguratorImpl,
  getLendingPoolConfiguratorProxy,
  getLendingPoolImpl,
  getPairsTokenAggregator,
  getPriceOracle,
  getProxy,
  getWalletProvider,
  getWETHGateway,
} from '../../helpers/contracts-getters';
import { verifyContract, getParamPerNetwork } from '../../helpers/contracts-helpers';
import { notFalsyOrZeroAddress } from '../../helpers/misc-utils';
import { eContractid, eNetwork, ICommonConfiguration } from '../../helpers/types';
import { deployAllMockAggregators } from '../../helpers/oracles-helpers';
import { getAllAggregatorsAddresses, getAllTokenAddresses } from '../../helpers/mock-helpers';
import { ethers, utils } from 'ethers';

const abi = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: 'sources',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'fallbackOracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'baseCurrencyUnit',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
    ],
    name: 'AssetSourceUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'baseCurrency',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'baseCurrencyUnit',
        type: 'uint256',
      },
    ],
    name: 'BaseCurrencySet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'fallbackOracle',
        type: 'address',
      },
    ],
    name: 'FallbackOracleUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BASE_CURRENCY',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BASE_CURRENCY_UNIT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getAssetPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
    ],
    name: 'getAssetsPrices',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFallbackOracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getSourceOfAsset',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: 'sources',
        type: 'address[]',
      },
    ],
    name: 'setAssetSources',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fallbackOracle',
        type: 'address',
      },
    ],
    name: 'setFallbackOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'AssetPriceUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'EthPriceUpdated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
    ],
    name: 'getAssetPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEthUsdPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'setAssetPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'setEthUsdPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

task('verify:general', 'Verify contracts at Etherscan')
  .addFlag('all', 'Verify all contracts at Etherscan')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ all, pool }, localDRE) => {
    await localDRE.run('set-DRE');
    const network = localDRE.network.name as eNetwork;
    const poolConfig = loadPoolConfig(pool);
    const {
      ReserveAssets,
      ReservesConfig,
      ProviderRegistry,
      MarketId,
      LendingPoolCollateralManager,
      LendingPoolConfigurator,
      LendingPool,
      WethGateway,
    } = poolConfig as ICommonConfiguration;
    const treasuryAddress = await getTreasuryAddress(poolConfig);

    const registryAddress = getParamPerNetwork(ProviderRegistry, network);
    const addressesProvider = await getLendingPoolAddressesProvider();
    const addressesProviderRegistry = notFalsyOrZeroAddress(registryAddress)
      ? await getLendingPoolAddressesProviderRegistry(registryAddress)
      : await getLendingPoolAddressesProviderRegistry();
    const lendingPoolAddress = await addressesProvider.getLendingPool();
    const lendingPoolConfiguratorAddress = await addressesProvider.getLendingPoolConfigurator(); //getLendingPoolConfiguratorProxy();
    const lendingPoolCollateralManagerAddress =
      await addressesProvider.getLendingPoolCollateralManager();

    const lendingPoolProxy = await getProxy(lendingPoolAddress);
    const lendingPoolConfiguratorProxy = await getProxy(lendingPoolConfiguratorAddress);
    const lendingPoolCollateralManagerProxy = await getProxy(lendingPoolCollateralManagerAddress);

    if (all) {
      // const lendingPoolImplAddress = getParamPerNetwork(LendingPool, network);
      // const lendingPoolImpl = notFalsyOrZeroAddress(lendingPoolImplAddress)
      //   ? await getLendingPoolImpl(lendingPoolImplAddress)
      //   : await getLendingPoolImpl();
      //
      // const lendingPoolConfiguratorImplAddress = getParamPerNetwork(
      //   LendingPoolConfigurator,
      //   network
      // );
      // const lendingPoolConfiguratorImpl = notFalsyOrZeroAddress(lendingPoolConfiguratorImplAddress)
      //   ? await getLendingPoolConfiguratorImpl(lendingPoolConfiguratorImplAddress)
      //   : await getLendingPoolConfiguratorImpl();
      //
      // const lendingPoolCollateralManagerImplAddress = getParamPerNetwork(
      //   LendingPoolCollateralManager,
      //   network
      // );
      // const lendingPoolCollateralManagerImpl = notFalsyOrZeroAddress(
      //   lendingPoolCollateralManagerImplAddress
      // )
      //   ? await getLendingPoolCollateralManagerImpl(lendingPoolCollateralManagerImplAddress)
      //   : await getLendingPoolCollateralManagerImpl();
      //
      // const dataProvider = await getAaveProtocolDataProvider();
      // const walletProvider = await getWalletProvider();
      //
      // const wethGatewayAddress = getParamPerNetwork(WethGateway, network);
      // const wethGateway = notFalsyOrZeroAddress(wethGatewayAddress)
      //   ? await getWETHGateway(wethGatewayAddress)
      //   : await getWETHGateway();

      // const {
      //     Mocks: { AllAssetsInitialPrices },
      //     ProtocolGlobalParams: { UsdAddress, MockUsdPriceInWei },
      //     LendingRateOracleRatesCommon,
      //     OracleQuoteCurrency,
      //     OracleQuoteUnit,
      // } = poolConfig as ICommonConfiguration;
      // const fallbackOracle = await getPriceOracle('0x0F9d5ED72f6691E47abe2f79B890C3C33e924092');
      // console.log(AllAssetsInitialPrices);
      const inter = new utils.Interface(_abi);
      console.log(
        inter.parseTransaction({
          data: '0x60c06040523480156200001157600080fd5b5060405162000f2238038062000f22833981810160405260a08110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82518660208202830111640100000000821117156200008c57600080fd5b82525081516020918201928201910280838360005b83811015620000bb578181015183820152602001620000a1565b5050505090500160405260200180516040519392919084640100000000821115620000e557600080fd5b908301906020820185811115620000fb57600080fd5b82518660208202830111640100000000821117156200011957600080fd5b82525081516020918201928201910280838360005b83811015620001485781810151838201526020016200012e565b5050505091909101604090815260208301519083015160609093015190945091925060009050620001786200023a565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a350620001cd836200023e565b620001d9858562000288565b6001600160601b0319606083901b1660805260a08190526040805182815290516001600160a01b038416917fe27c4c1372396a3d15a9922f74f9dfc7c72b1ad6d63868470787249c356454c1919081900360200190a25050505050620003d4565b3390565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fce7a780d33665b1ea097af5f155e3821b809ecbaa839d3b33aa83ba28168cefb90600090a250565b8051825114620002df576040805162461bcd60e51b815260206004820152601a60248201527f494e434f4e53495354454e545f504152414d535f4c454e475448000000000000604482015290519081900360640190fd5b60005b8251811015620003cf57818181518110620002f957fe5b6020026020010151600160008584815181106200031257fe5b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b031602179055508181815181106200036b57fe5b60200260200101516001600160a01b03168382815181106200038957fe5b60200260200101516001600160a01b03167f22c5b7b2d8561d39f7f210b6b326a1aa69f15311163082308ac4877db6339dc160405160405180910390a3600101620002e2565b505050565b60805160601c60a051610b1d6200040560003980610437528061063d52508061061352806107f45250610b1d6000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806392bf2be01161007157806392bf2be0146101245780639d23d9f21461014a578063abfd53101461020a578063b3596f07146102cc578063e19f4700146102f2578063f2fde38b146102fa576100a9565b8063170aee73146100ae5780636210308c146100d6578063715018a6146100fa5780638c89b64f146101025780638da5cb5b1461011c575b600080fd5b6100d4600480360360208110156100c457600080fd5b50356001600160a01b0316610320565b005b6100de610384565b604080516001600160a01b039092168252519081900360200190f35b6100d4610393565b61010a610435565b60408051918252519081900360200190f35b6100de610459565b6100de6004803603602081101561013a57600080fd5b50356001600160a01b0316610468565b6101ba6004803603602081101561016057600080fd5b81019060208101813564010000000081111561017b57600080fd5b82018360208201111561018d57600080fd5b803590602001918460208302840111640100000000831117156101af57600080fd5b509092509050610489565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156101f65781810151838201526020016101de565b505050509050019250505060405180910390f35b6100d46004803603604081101561022057600080fd5b81019060208101813564010000000081111561023b57600080fd5b82018360208201111561024d57600080fd5b8035906020019184602083028401116401000000008311171561026f57600080fd5b91939092909160208101903564010000000081111561028d57600080fd5b82018360208201111561029f57600080fd5b803590602001918460208302840111640100000000831117156102c157600080fd5b509092509050610526565b61010a600480360360208110156102e257600080fd5b50356001600160a01b03166105f1565b6100de6107f2565b6100d46004803603602081101561031057600080fd5b50356001600160a01b0316610816565b61032861090e565b6000546001600160a01b03908116911614610378576040805162461bcd60e51b81526020600482018190526024820152600080516020610ac8833981519152604482015290519081900360640190fd5b61038181610912565b50565b6002546001600160a01b031690565b61039b61090e565b6000546001600160a01b039081169116146103eb576040805162461bcd60e51b81526020600482018190526024820152600080516020610ac8833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b031690565b6001600160a01b03808216600090815260016020526040902054165b919050565b6060808267ffffffffffffffff811180156104a357600080fd5b506040519080825280602002602001820160405280156104cd578160200160208202803683370190505b50905060005b8381101561051e576104ff8585838181106104ea57fe5b905060200201356001600160a01b03166105f1565b82828151811061050b57fe5b60209081029190910101526001016104d3565b509392505050565b61052e61090e565b6000546001600160a01b0390811691161461057e576040805162461bcd60e51b81526020600482018190526024820152600080516020610ac8833981519152604482015290519081900360640190fd5b6105eb8484808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152505060408051602080880282810182019093528782529093508792508691829185019084908082843760009201919091525061095c92505050565b50505050565b6001600160a01b038082166000818152600160205260408120549092908116917f00000000000000000000000000000000000000000000000000000000000000009091161415610664577f0000000000000000000000000000000000000000000000000000000000000000915050610484565b6001600160a01b0381166106f4576002546040805163b3596f0760e01b81526001600160a01b0386811660048301529151919092169163b3596f07916024808301926020929190829003018186803b1580156106bf57600080fd5b505afa1580156106d3573d6000803e3d6000fd5b505050506040513d60208110156106e957600080fd5b505191506104849050565b6000816001600160a01b03166350d25bcd6040518163ffffffff1660e01b815260040160206040518083038186803b15801561072f57600080fd5b505afa158015610743573d6000803e3d6000fd5b505050506040513d602081101561075957600080fd5b50519050600081131561076f5791506104849050565b6002546040805163b3596f0760e01b81526001600160a01b0387811660048301529151919092169163b3596f07916024808301926020929190829003018186803b1580156107bc57600080fd5b505afa1580156107d0573d6000803e3d6000fd5b505050506040513d60208110156107e657600080fd5b50519250610484915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b61081e61090e565b6000546001600160a01b0390811691161461086e576040805162461bcd60e51b81526020600482018190526024820152600080516020610ac8833981519152604482015290519081900360640190fd5b6001600160a01b0381166108b35760405162461bcd60e51b8152600401808060200182810382526026815260200180610aa26026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b3390565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fce7a780d33665b1ea097af5f155e3821b809ecbaa839d3b33aa83ba28168cefb90600090a250565b80518251146109b2576040805162461bcd60e51b815260206004820152601a60248201527f494e434f4e53495354454e545f504152414d535f4c454e475448000000000000604482015290519081900360640190fd5b60005b8251811015610a9c578181815181106109ca57fe5b6020026020010151600160008584815181106109e257fe5b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b03160217905550818181518110610a3a57fe5b60200260200101516001600160a01b0316838281518110610a5757fe5b60200260200101516001600160a01b03167f22c5b7b2d8561d39f7f210b6b326a1aa69f15311163082308ac4877db6339dc160405160405180910390a36001016109b5565b50505056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572a2646970667358221220eb57f0f25d819c5e0f2a38b68292d8ef783d86dd75dea94e4aca3442859c7f0564736f6c634300060c003300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000005c00000000000000000000000000f9d5ed72f6691e47abe2f79b890c3c33e92409200000000000000000000000029442c77d021be436f30122fc497542f22ce54270000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000280000000000000000000000006d9ce2bb4e1f5c88acf2fbd341e7aa12a35da16900000000000000000000000007db728dcb6ebe70af2397d713377944687f496c0000000000000000000000009c008818bc5ec76027e3663f02bcf77606fb6b8200000000000000000000000045cb82b11aced896176459c33ee5f7232806287900000000000000000000000052e3e0d7d37c138bb6d1882423e35f4e34e5349c0000000000000000000000006031a903e40d0cf8c23bf4ab86f9fc9108834119000000000000000000000000bf1b644c348f3d6b4e617d436d0e211cf0ea844a000000000000000000000000b30a0c39bbfc213dfb31c3bc43f2e2e7ce652000000000000000000000000000e56c6e38e3a55b143a8e6655584ff477a504da89000000000000000000000000d77382f759cf5f8c1c0b50ee4966ea9feb88275500000000000000000000000081e511e691dde0a779f95b0c078a1e7abb41c0750000000000000000000000008e95be47351867a5ff31b757262bd5a910dd0929000000000000000000000000c5cab8da69f87d930b73b5db7f3fef95e28a27500000000000000000000000000612f73ac7ac6be44e6ce10d8c1bd00993cd31910000000000000000000000002c1f27fddc98d97ee1ab872b2772cfe69b6f09f90000000000000000000000001a7fc9daa5499aacf8bd739d0e2c29a1f262b6bd000000000000000000000000da73cfc325036bf2e452384ae1beb5cf1e1fb3df000000000000000000000000e39beb746723224674063d812efd4973a849998c0000000000000000000000002be3cd3d1cc1b22313a7813352650b2feae2bed100000000000000000000000018d9a88120a1ccbdfe6c2bb873a7c7364c18fd66000000000000000000000000358f5dff01a0e251d95759b339f546a4053c3bfd000000000000000000000000482ef40bcbcacf9eab44a4535bd48882519bd3960000000000000000000000006491a30b482c0625cda90352f67e9fc48c11b011000000000000000000000000da8833c61e927e29b87f12c4b119c1c4ef61b1cf000000000000000000000000451d57af406bed31ad2c9efcea538e0b51bc4f060000000000000000000000000e9cdfd62536a466350a1458e60f82fc8bd32850000000000000000000000000fffc6416a1190a7250280602721af24f1068d817000000000000000000000000d0b54b0076307a689cd6d11743f7bd776a5673f50000000000000000000000002db11ce0ccecf72e2fab59658672cb1a76237010000000000000000000000000e38e80c20a1478293816c418af762b896aeac0b8000000000000000000000000518148892eb3e7e8837d755677bdf866e377485e000000000000000000000000bfb5189f1cc83d92bee523ca5e5090034f2228fc000000000000000000000000b74eefb9228ac899759cb25693d2e88a1a18a3f1000000000000000000000000860beb4c07e4ceae775896c861d02244d9ef050d000000000000000000000000a8f0a0281dbb2e6b52ac443c30bee7a7c745f5aa000000000000000000000000d5e2b2b5a259f761cf3f8c6cac16e67706c22569000000000000000000000000265dda7ba6034436d21646b45d5432bcfd2f416c000000000000000000000000ee9365224c1c467ce2f0fe9ce8caaafff3da9c5e000000000000000000000000a62b7c40f897e5a96c0b00a32d2ec7018b187a7d0000000000000000000000007742cd04c3649d2f49ec40f7a3cc8fcb6cb45386000000000000000000000000000000000000000000000000000000000000002800000000000000000000000073df320f474623ef0510e5ac8f0a115250ef0641000000000000000000000000e73aa41421107e76922d433969879b977b512dca0000000000000000000000006446197114b5e8dd7b3ade5433d871df68e7729d000000000000000000000000679b5ad2248ce9d611badd2587c901bab20ab72c00000000000000000000000000b37c6b3960e4f11781080abcb9898fe85907260000000000000000000000001bea9da8534f0b25042baed791dd081e9e6c17d20000000000000000000000004309813c061a5c091952333c7084593cc34c9f07000000000000000000000000ba0c835fc7e19ed2cc4fe1bb26633e6af6cb088800000000000000000000000038ccd0db21d09c1e41b24f3c394fb82798a2d4a4000000000000000000000000c4806e21c1c0147afbcae59a65c66dfd64a142bf000000000000000000000000ec3e329abee6a454c0ec9dc52f804caf8434627f00000000000000000000000034992834973b15e3234ae5063dd6ce27e5ecd1da000000000000000000000000a4ca3357d649495d296feb7168d18cd2c90b604d000000000000000000000000c33dc6dd8a761341619a401cb92a09043e581e120000000000000000000000002ea3a7918fa00196be0d9eb05a849394575c483e000000000000000000000000863cc81f3c90158cb422734af55cb40cf75198f4000000000000000000000000e9886555667517ac40ae85f4944bc1b3bb4b4a800000000000000000000000001428e254138cc319780638b18830a3512b280223000000000000000000000000486ccea3d0f74e5fe03376196a1005d82e63db2700000000000000000000000067528d79fad92a630b13d43f626206df1d603bf6000000000000000000000000b6fd7e343418fb563cb06a41889a57b43d7cbcee0000000000000000000000006e2a17d2a09e4cdf9df37f683a36a403a52d0301000000000000000000000000e21b105befed0c5b412d1ff5fc82e1a25f44d4a40000000000000000000000003d521bf1581fcab0ab62bea89903192939460ea2000000000000000000000000a87cf6d76bde5c0be8a4736d300699f324576ac100000000000000000000000047dfdfdaaf6506329e0c5e3b2b020b65aa3b2a2d0000000000000000000000006a95f65f153c576763af1c376b0492e9abcf2929000000000000000000000000e550ea8cff9500e97674b1f661a904ed41ca29530000000000000000000000007df6d8129c129c4611bb9f6ddf49f4c4f271843100000000000000000000000092d5979974cb3129661c03a7f7c94ccbc55872d100000000000000000000000023fcdcd00d04ccfc83cb3a120872debc0df134b50000000000000000000000002506ca9fd51344cba43b33ae1a664ed4f93acdfa00000000000000000000000044251912c601da84a9e0362a8c4a1096916604b2000000000000000000000000e46d48a39317f5350acb15f71c9282fb926ed6df000000000000000000000000d980e0b05100b1357d52cf408e4c65b085a99af800000000000000000000000023ab283748c6827de509e6f11e33d82baa99b462000000000000000000000000940bfb18f1af2530dc3e82b1eb0fd28770f957070000000000000000000000005af874a1f10f72544a13a3b2f915fd3b76272ac300000000000000000000000046a80b8e7e52f2e326a7cdfc5ddfffd54f11638d0000000000000000000000002af57ff4cb8adb7543f6705e33e3d9883ef231f4',
          value: 0,
        })
      );
      // const mockAggregators = await getAllAggregatorsAddresses() await deployAllMockAggregators(AllAssetsInitialPrices);
      // const mockAggregators = await deployAllMockAggregators(AllAssetsInitialPrices, verify);
      // const allTokenAddresses = getAllTokenAddresses(mockTokens);
      //   mockAggregators
      //
      //   const [tokens, aggregators] = getPairsTokenAggregator(
      //       allTokenAddresses,
      //       mockAggregators,
      //       OracleQuoteCurrency
      //   );
      //
      //
      //   console.log("verify price oracle")
      // const priceOracleAddress = await addressesProvider.getPriceOracle()
      //   const priceOracle = await getPriceOracle(priceOracleAddress);
      //   await verifyContract(eContractid.PriceOracle, priceOracle, [tokens, ["0xE9886555667517aC40Ae85f4944bc1B3BB4b4A80"], fallbackOracle.address, await getQuoteCurrency(poolConfig), OracleQuoteUnit]);

      // Address Provider
      // console.log('\n- Verifying address provider...\n');
      // await verifyContract(eContractid.LendingPoolAddressesProvider, addressesProvider, [MarketId]);
      //
      // // Address Provider Registry
      // console.log('\n- Verifying address provider registry...\n');
      // await verifyContract(
      //   eContractid.LendingPoolAddressesProviderRegistry,
      //   addressesProviderRegistry,
      //   []
      // );

      // Lending Pool implementation
      //   console.log(lendingPoolImpl.address)
      // console.log('\n- Verifying LendingPool Implementation...\n');
      // await verifyContract(eContractid.LendingPool, lendingPoolImpl, []);

      // // Lending Pool Configurator implementation
      // console.log('\n- Verifying LendingPool Configurator Implementation...\n');
      // await verifyContract(eContractid.LendingPoolConfigurator, lendingPoolConfiguratorImpl, []);
      //
      // // Lending Pool Collateral Manager implementation
      // console.log('\n- Verifying LendingPool Collateral Manager Implementation...\n');
      // await verifyContract(
      //   eContractid.LendingPoolCollateralManager,
      //   lendingPoolCollateralManagerImpl,
      //   []
      // );
      //
      // // Test helpers
      // console.log('\n- Verifying  Aave  Provider Helpers...\n');
      // await verifyContract(eContractid.AaveProtocolDataProvider, dataProvider, [
      //   addressesProvider.address,
      // ]);
      //
      // // Wallet balance provider
      // console.log('\n- Verifying  Wallet Balance Provider...\n');
      // await verifyContract(eContractid.WalletBalanceProvider, walletProvider, []);
      //
      // // WETHGateway
      // console.log('\n- Verifying  WETHGateway...\n');
      // await verifyContract(eContractid.WETHGateway, wethGateway, [
      //   await getWrappedNativeTokenAddress(poolConfig),
      // ]);
    }
    // // Lending Pool proxy
    // console.log('\n- Verifying  Lending Pool Proxy...\n');
    // await verifyContract(eContractid.InitializableAdminUpgradeabilityProxy, lendingPoolProxy, [
    //   addressesProvider.address,
    // ]);
    //
    // // LendingPool Conf proxy
    // console.log('\n- Verifying  Lending Pool Configurator Proxy...\n');
    // await verifyContract(
    //   eContractid.InitializableAdminUpgradeabilityProxy,
    //   lendingPoolConfiguratorProxy,
    //   [addressesProvider.address]
    // );

    // Proxy collateral manager
    // console.log('\n- Verifying  Lending Pool Collateral Manager Proxy...\n');
    // await verifyContract(
    //   eContractid.InitializableAdminUpgradeabilityProxy,
    //   lendingPoolCollateralManagerProxy,
    //   []
    // );
    //
    // console.log('Finished verifications.');
  });
