import pandas as pd
import base64
import io
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib
matplotlib.use("Agg")


def plot_forecast(forecast: list[dict], product: str) -> str:
    df = pd.DataFrame(forecast)

    plt.figure(figsize=(10, 6))
    plt.plot(df["ds"], df["yhat"], label="Forecast",
             color="royalblue", linewidth=2)
    plt.fill_between(df["ds"], df["yhat_lower"], df["yhat_upper"],
                     color="royalblue", alpha=0.2, label="Confidence Interval")

    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %d'))
    plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=1))
    plt.xticks(rotation=45)

    plt.xlabel("Date")
    plt.ylabel("Predicted Revenue")
    plt.title(f"Forecast for {product}")
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.4)
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)

    return base64.b64encode(buf.read()).decode("utf-8")
