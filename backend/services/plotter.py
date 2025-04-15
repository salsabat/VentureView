import matplotlib.pyplot as plt
from io import BytesIO
import base64
import pandas as pd


def plot_forecast(forecast: list[dict], product: str) -> str:
    df = pd.DataFrame(forecast)

    plt.figure(figsize=(10, 5))
    plt.plot(df["ds"], df["yhat"], label="Forecast", linewidth=2)
    plt.fill_between(df["ds"], df["yhat_lower"], df["yhat_upper"],
                     alpha=0.2, label="Confidence Interval")
    plt.xlabel("Date")
    plt.ylabel("Predicted Revenue")
    plt.title(f"Forecast for {product}")
    plt.legend()
    plt.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)

    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    return img_base64
