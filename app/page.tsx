"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

type ExchangeRates = {
  [key: string]: number;
};

type Currency = "USD" | "INR" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

export default function Home() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("INR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        setError("Error fetching exchange rates.");
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <main className="flex flex-col justify-center items-center bg-linear-to-t from-sky-500 to-indigo-500 px-4 h-screen">
      <h1 className="mb-2 font-semibold text-white text-3xl md:text-4xl text-center">
        Currency Converter
      </h1>
      <p className="mb-12 font-normal text-gray-100 text-base md:text-xl leading-[1.8rem]">
        Check live foreign currency exchange rates
      </p>
      <Card className="space-y-4 p-6 rounded-3xl w-full max-w-3xl">
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader className="w-6 h-6 text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="gap-4 grid">
              <div className="items-center gap-2 grid grid-cols-[1fr_auto]">
                <Label htmlFor="from" className="text-lg">
                  From
                </Label>
                <div className="items-center gap-2 grid grid-cols-[1fr_auto]">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount || ""}
                    onChange={handleAmountChange}
                    className="w-full"
                    id="from"
                  />
                  <Select value={sourceCurrency} onValueChange={handleSourceCurrencyChange}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="items-center gap-2 grid grid-cols-[1fr_auto]">
                <Label htmlFor="to" className="text-lg">
                  To
                </Label>
                <div className="items-center gap-2 grid grid-cols-[1fr_auto]">
                  <div className="font-bold text-2xl">{convertedAmount}</div>
                  <Select value={targetCurrency} onValueChange={handleTargetCurrencyChange}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="EUR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="bg-blue-500 hover:bg-[#207FE6] px-6 py-3 rounded-lg w-full h-fit font-semibold text-white text-base transition-colors duration-200"
            onClick={calculateConvertedAmount}
          >
            Convert
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
