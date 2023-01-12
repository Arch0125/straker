import * as React from 'react';
import { useBalance } from 'wagmi';
import GetAccount from './GetAccount';


const GetBalance = () => {

    const address = GetAccount();

    const { data, isError, isLoading } = useBalance({
        address: address,
    })

    {
        if (isLoading) {
            return "...";
        }
        if(isError) {
            return "Error";
        }
        if (data) {
            return data?.formatted;
        }
    }
  
};

export default GetBalance;
