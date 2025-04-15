from prophet import Prophet
import pandas as pd


def run_forecast(product: str, df, horizon=30):
    required = {"product", "date", "revenue"}
    if not required.issubset(set(df.columns)):
        return {
            "status": "error",
            "message": f"Missing required columns: {required - set(df.columns)}"
        }

    product_df = df[df["product"] == product].copy()
    if product_df.empty or len(product_df) < 2:
        return {
            "status": "error",
            "message": f"Not enough data to forecast product '{product}'."
        }

    product_df["ds"] = pd.to_datetime(product_df["date"])
    product_df["y"] = product_df["revenue"]

    model = Prophet(daily_seasonality=True)
    model.fit(product_df[["ds", "y"]])

    future = model.make_future_dataframe(periods=horizon)
    forecast = model.predict(future)

    result_df = forecast[["ds", "yhat",
                          "yhat_lower", "yhat_upper"]].tail(horizon)

    return result_df.to_dict(orient="records")
