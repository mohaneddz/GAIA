"""Synthetic multi-lead ECG.

Adapted from the AI4health generator (ecg.py) written for this project: the
Gaussian P-Q-R-S-T beat model and the spike-and-hump pulse beat are kept as
they were. Changes: samples are returned instead of written to a JS file, the
RNG is seedable, and each beat gets a jittered R-R interval so the rhythm has
measurable heart-rate variability instead of a perfectly fixed period.
"""

import numpy as np

LEAD_NAMES = [f"lead{i + 1}" for i in range(9)]

# Leads 3-6 (indices 2-5) use the pulse-style beat, as in the original generator.
PULSE_LEADS = range(2, 6)


def _gaussian(x, mu, sigma, amplitude):
    return amplitude * np.exp(-0.5 * ((x - mu) / sigma) ** 2)


def _normal_beat(rng, t0, beat_len, fs, amp_scale, phase_shift):
    local_t = np.arange(round(beat_len * fs)) / fs
    shifted = local_t + phase_shift

    p_wave = _gaussian(shifted, 0.10 * beat_len, 0.025, 0.15 * amp_scale)
    q_wave = _gaussian(shifted, 0.18 * beat_len, 0.010, -0.05 * amp_scale)
    r_wave = _gaussian(shifted, 0.20 * beat_len, 0.008, 1.0 * amp_scale)
    s_wave = _gaussian(shifted, 0.22 * beat_len, 0.008, -0.25 * amp_scale)
    t_wave = _gaussian(shifted, 0.35 * beat_len, 0.060, 0.3 * amp_scale)

    baseline = 0.02 * np.sin(2 * np.pi * 0.33 * (t0 + local_t))
    noise = (rng.random(len(local_t)) - 0.5) * 0.01
    return p_wave + q_wave + r_wave + s_wave + t_wave + baseline + noise


def _pulse_beat(rng, t0, beat_len, fs, amp_scale):
    local_t = np.arange(round(beat_len * fs)) / fs

    spike = _gaussian(local_t, 0.05 * beat_len, 0.01, 1.0 * amp_scale)
    hump = _gaussian(local_t, 0.20 * beat_len, 0.07, 0.5 * amp_scale)
    decay = np.exp(-3 * local_t / beat_len)

    values = (spike + hump) * decay
    values -= np.mean(values) * 0.5
    values += 0.02 * np.sin(2 * np.pi * 0.2 * (t0 + local_t))
    values += (rng.random(len(local_t)) - 0.5) * 0.005
    return values


def generate_ecg(duration_sec=10.0, fs=250, heart_rate=72.0, hrv_ms=30.0, seed=None):
    """Return (times, leads) where leads is a (9, n) array in millivolts."""
    rng = np.random.default_rng(seed)
    mean_interval = 60.0 / heart_rate

    times = []
    lead_values = [[] for _ in LEAD_NAMES]
    t0 = 0.0

    while t0 < duration_sec:
        # Whole samples per beat keeps the time axis on a uniform 1/fs grid.
        beat_len = round(max(0.3, rng.normal(mean_interval, hrv_ms / 1000)) * fs) / fs
        beat_times = t0 + np.arange(round(beat_len * fs)) / fs
        times.append(beat_times)

        for lead in range(len(LEAD_NAMES)):
            amp_scale = rng.uniform(0.85, 1.15)
            if lead in PULSE_LEADS:
                values = _pulse_beat(rng, t0, beat_len, fs, amp_scale)
            else:
                phase_shift = rng.uniform(-0.02, 0.02)
                values = _normal_beat(rng, t0, beat_len, fs, amp_scale, phase_shift)
            lead_values[lead].append(values)

        t0 += beat_len

    all_times = np.concatenate(times)
    keep = all_times < duration_sec
    leads = np.array([np.concatenate(values)[keep] for values in lead_values])
    return all_times[keep], leads


def detect_r_peaks(signal, fs, threshold=0.5, refractory_sec=0.25):
    """Indices of local maxima above threshold, at least refractory_sec apart."""
    is_peak = (signal[1:-1] > signal[:-2]) & (signal[1:-1] >= signal[2:]) & (signal[1:-1] > threshold)
    candidates = np.flatnonzero(is_peak) + 1

    peaks = []
    min_gap = int(refractory_sec * fs)
    for index in candidates:
        if peaks and index - peaks[-1] < min_gap:
            if signal[index] > signal[peaks[-1]]:
                peaks[-1] = index
            continue
        peaks.append(index)
    return np.array(peaks, dtype=int)


def ecg_vitals(leads, fs):
    """Heart rate and R-R variability measured from R peaks on lead 1."""
    peaks = detect_r_peaks(leads[0], fs)
    if len(peaks) < 2:
        return {"heartRate": None, "rrStdMs": None, "rrMeanMs": None, "beatCount": int(len(peaks))}

    rr_ms = np.diff(peaks) / fs * 1000
    return {
        "heartRate": round(float(60000 / rr_ms.mean()), 1),
        "rrStdMs": round(float(rr_ms.std(ddof=1)) if len(rr_ms) > 1 else 0.0, 1),
        "rrMeanMs": round(float(rr_ms.mean()), 1),
        "beatCount": int(len(peaks)),
    }
