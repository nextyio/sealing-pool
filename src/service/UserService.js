import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash' // eslint-disable-line
import WalletService from '@/service/WalletService'
import { WEB3, CONTRACTS } from '@/constant'

export default class extends BaseService {
  async decryptWallet (privatekey) {
    const userRedux = this.store.getRedux('user')

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))

    const NTFToken = web3.eth.contract(WEB3.PAGE['NTFToken'].ABI)
    const NTFTokenContract = NTFToken.at(WEB3.PAGE['NTFToken'].ADDRESS)

    const NextyManager = web3.eth.contract(WEB3.PAGE['NextyManager'].ABI)
    const NextyManagerContract = NextyManager.at(WEB3.PAGE['NextyManager'].ADDRESS)
    const contract = {
      NTFToken: NTFTokenContract,
      NextyManager: NextyManagerContract
    }

    const wallet = new WalletService(privatekey)
    const walletAddress = wallet.getAddressString()

    if (!walletAddress) {
      return
    }

    web3.eth.defaultAccount = walletAddress
    wallet.balance = web3.eth.getBalance(walletAddress)

    await this.dispatch(userRedux.actions.wallet_update(walletAddress))

    // const owner = contract.owner()
    /*
        const owner = {
            NTFToken: NTFTokenContract.owner(),
            NextyManager : NextyManagerContract.owner()
        }
*/
    // const owner = contract.owner()
    const contractAdress = {
      NTFToken: WEB3.PAGE['NTFToken'].ADDRESS,
      NextyManager: WEB3.PAGE['NextyManager'].ADDRESS
    }
    // console.log("owner=" + owner)
    // console.log("address=" + walletAddress)
    /*
        if (walletAddress === owner) {
            await this.dispatch(userRedux.actions.is_admin_update(true))
        }
        */
    sessionStorage.setItem('contract-adress', contractAdress) // eslint-disable-line
    await this.dispatch(userRedux.actions.is_login_update(true))
    await this.dispatch(userRedux.actions.profile_update({
      web3,
      wallet,
      contract
    }))
    await this.dispatch(userRedux.actions.login_form_reset())

    return true
  }

  async metaMaskLogin (address) {
    const userRedux = this.store.getRedux('user')
    const contractsRedux = this.store.getRedux('contracts')
    // let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
    let web3 = new Web3(window.ethereum)

    const contracts = {
      NtfToken: new web3.eth.Contract(CONTRACTS.NtfToken.abi, CONTRACTS.NtfToken.address),
      NtfPool: new web3.eth.Contract(CONTRACTS.NtfPool.abi, CONTRACTS.NtfPool.address),
      // NextyGovernance: new web3.eth.Contract(CONTRACTS.NextyGovernance.abi, CONTRACTS.NextyGovernance.address)
    }

    web3.eth.defaultAccount = address
    await this.dispatch(userRedux.actions.is_login_update(true))
    await this.dispatch(userRedux.actions.wallet_update(address))
    await this.dispatch(userRedux.actions.web3_update(web3))
    await this.dispatch(contractsRedux.actions.ntfToken_update(contracts.NtfToken))
    await this.dispatch(contractsRedux.actions.ntfPool_update(contracts.NtfPool))
    // await this.dispatch(contractsRedux.actions.nextyGovernance_update(contracts.NextyGovernance))

    return true
  }

  async loadBlockNumber () {
    const userRedux = this.store.getRedux('user')
    const storeUser = this.store.getState().user
    let { web3 } = storeUser
    const _blockNumber = await web3.eth.getBlockNumber()
    await this.dispatch(userRedux.actions.blockNumber_update(_blockNumber))
  }

  async getBalance () {
    const userRedux = this.store.getRedux('user')
    const storeUser = this.store.getState().user
    let { web3, wallet } = storeUser
    const balance = await web3.eth.getBalance(wallet)
    await this.dispatch(userRedux.actions.balance_update(balance))
  }

  async logout () {
    const userRedux = this.store.getRedux('user')
    const tasksRedux = this.store.getRedux('task')

    return new Promise((resolve) => {
      this.dispatch(userRedux.actions.is_login_update(false))
      this.dispatch(userRedux.actions.is_admin_update(false))
      this.dispatch(userRedux.actions.loginMetamask_update(false))
      this.dispatch(userRedux.actions.profile_reset())
      this.dispatch(tasksRedux.actions.all_tasks_reset())
      // sessionStorage.clear() // eslint-disable-line
      resolve(true)
    })
  }
}
