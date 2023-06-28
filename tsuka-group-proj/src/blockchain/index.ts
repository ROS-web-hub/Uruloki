import React, { useState } from 'react';
import { ethers } from 'ethers';
import { prepareWriteContract, writeContract, getContract, fetchSigner } from '@wagmi/core'

import Uruloki from './abi/Uruloki.json';
import ERC20 from './abi/ERC20.json';

/* TODO
   1. Create order
   2. Edit order
   3. Delete order
   4. Add funds
   5. Withdraw funds
*/

export const useUrulokiAPI = () => {
    const chainId = 5;     // Goerli network
    const [isRunning, setIsRunning] = useState(false);

    const parseUnits = (value: number, decimal: number) => {
        return ethers.utils.parseUnits(value.toString(), decimal)
    }

    const addFunds = async (tokenAddress: string, amount: number) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();
                const tx = await ERC20Contract.approve(`0x${Uruloki.address}`, parseUnits(amount, decimals));
                await tx.wait();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'addFunds',
                    args: [tokenAddress, parseUnits(amount, decimals)],
                    chainId: chainId
                });

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('addFunds = ', err);
            return { msg: 'failure' };
        }
    }

    const withdrawFunds = async (tokenAddress: string, amount: number) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'withdrawFunds',
                    args: [tokenAddress, parseUnits(amount, decimals)],
                    chainId: chainId
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err: any) {
            console.error('withdrawFunds = ', err);
            return { msg: 'failure' };
        }
    }

    const createNonContinuousPriceRangeOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'createNonContinuousPriceRangeOrder',
                    args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals)],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('createNonContinuousPriceRangeOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const createNonContinuousTargetPriceOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'createNonContinuousTargetPriceOrder',
                    args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals)],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('createNonContinuousTargetPriceOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const createContinuousPriceRangeOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'createContinuousPriceRangeOrder',
                    args: [pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals), resetPercentage],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('createContinuousPriceRangeOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const createContinuousTargetPriceOrder = async (
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })

                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'createContinuousTargetPriceOrder',
                    args: [pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals), resetPercentage],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('createContinuousTargetPriceOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const editNonContinuousPriceRangeOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })

                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'editNonContinuousPriceRangeOrder',
                    args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals)],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('editNonContinuousPriceRangeOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const editNonContinuousTargetPriceOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'editNonContinuousTargetPriceOrder',
                    args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals)],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('editNonContinuousTargetPriceOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const editContinuousPriceRangeOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        minPrice: number,
        maxPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'editContinuousPriceRangeOrder',
                    args: [orderId, pairedTokenAddress, tokenAddress, isBuy, minPrice, maxPrice, parseUnits(amount, decimals), resetPercentage],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('editContinuousPriceRangeOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const editContinuousTargetPriceOrder = async (
        orderId: number,
        pairedTokenAddress: string,
        tokenAddress: string,
        isBuy: boolean,
        targetPrice: number,
        amount: number,
        resetPercentage: number
    ) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                const ERC20Contract = getContract({
                    address: tokenAddress,
                    abi: ERC20.abi,
                    signerOrProvider: signer
                })
                setIsRunning(true);
                const decimals = await ERC20Contract.decimals();

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'editContinuousTargetPriceOrder',
                    args: [orderId, pairedTokenAddress, tokenAddress, isBuy, targetPrice, parseUnits(amount, decimals), resetPercentage],
                })

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('editContinuousTargetPriceOrder = ', err);
            return { msg: 'failure' };
        }
    }

    const cancelOrder = async (orderId: number) => {
        try {
            const signer = await fetchSigner();

            if (signer) {
                setIsRunning(true);

                const config = await prepareWriteContract({
                    address: `0x${Uruloki.address}`,
                    abi: Uruloki.abi,
                    functionName: 'cancelOrder',
                    args: [orderId],
                });

                const { hash, wait } = await writeContract(config);
                await wait();
                setIsRunning(false);

                return { msg: 'success', hash: hash };
            }
        } catch (err) {
            console.error('cancelOrder = ', err);
            return { msg: 'failure' };
        }
    }

    return {
        isRunning,
        addFunds,
        withdrawFunds,
        createContinuousPriceRangeOrder,
        createContinuousTargetPriceOrder,
        createNonContinuousPriceRangeOrder,
        createNonContinuousTargetPriceOrder,
        editContinuousPriceRangeOrder,
        editContinuousTargetPriceOrder,
        editNonContinuousPriceRangeOrder,
        editNonContinuousTargetPriceOrder,
        cancelOrder,
    };
}