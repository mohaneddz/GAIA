"""Synthetic 12-channel EEG.

Adapted from the AI4health generator (egg.py) written for this project: each
channel is the sum of one sinusoid per clinical band plus a little noise, as in
the original. Changes: samples are returned instead of written to a JS file,
the RNG is seedable, and band powers are measured back from the spectrum.
"""

import numpy as np

CHANNEL_NAMES = ["Fp1", "Fp2", "F3", "F4", "C3", "C4", "P3", "P4", "O1", "O2", "T3", "T4"]

BANDS = {
    "delta": (1, 4),
    "theta": (4, 8),
    "alpha": (8, 12),
    "beta": (12, 30),
    "gamma": (30, 45),
}


def _channel_signal(rng, times):
    signal = np.zeros(len(times))
    for low, high in BANDS.values():
        freq = rng.uniform(low, high)
        phase = rng.uniform(0, 2 * np.pi)
        amplitude = rng.uniform(5, 20) / 100
        signal += amplitude * np.sin(2 * np.pi * freq * times + phase)
    signal += (rng.random(len(times)) - 0.5) * 0.02
    return signal


def generate_eeg(duration_sec=10.0, fs=250, seed=None):
    """Return (times, channels) where channels is a (12, n) array."""
    rng = np.random.default_rng(seed)
    times = np.arange(int(duration_sec * fs)) / fs
    channels = np.array([_channel_signal(rng, times) for _ in CHANNEL_NAMES])
    return times, channels


def band_powers(channels, fs):
    """Power per band summed over channels, from a Hann-windowed FFT."""
    window = np.hanning(channels.shape[1])
    spectrum = np.abs(np.fft.rfft(channels * window, axis=1)) ** 2
    freqs = np.fft.rfftfreq(channels.shape[1], 1 / fs)

    powers = {}
    for name, (low, high) in BANDS.items():
        in_band = (freqs >= low) & (freqs < high)
        powers[name] = float(spectrum[:, in_band].sum())
    return powers


def eeg_metrics(channels, fs):
    powers = band_powers(channels, fs)
    total = sum(powers.values())
    channel_rms = np.sqrt(np.mean(channels ** 2, axis=1))

    return {
        "alphaBetaRatio": round(powers["alpha"] / powers["beta"], 2),
        "thetaRelative": round(powers["theta"] / total, 3),
        "deltaRelative": round(powers["delta"] / total, 3),
        "waveVariability": round(float(channel_rms.std() / channel_rms.mean()), 3),
        "bandRelative": {name: round(power / total, 3) for name, power in powers.items()},
    }
