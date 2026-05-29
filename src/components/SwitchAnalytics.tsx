import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  TrendingUp, 
  UserSquare2, 
  ChevronRight, 
  ChevronLeft,
  Timer,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SwitchLog, SavedAlter } from '../types';

interface SwitchAnalyticsProps {
  switchLogs: SwitchLog[];
  savedAlters: SavedAlter[];
  lang: 'fr' | 'en';
  t: any;
}

type FilterRange = '24h' | '3d' | '7d';

export default function SwitchAnalytics({ switchLogs = [], savedAlters = [], lang, t }: SwitchAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'frequency' | 'ratio'>('timeline');
  const [timelineRange, setTimelineRange] = useState<FilterRange>('3d');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  // Helper date utility
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatWeekdayShort = (date: Date) => {
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'short',
    });
  };

  // Convert status to readable text
  const getStatusLabel = (status?: string) => {
    if (!status || status === 'none') return '';
    return t.frontStatuses[status] || status;
  };

  const getStatusColorClass = (status?: string) => {
    switch (status) {
      case 'primary': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'co_front': return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
      case 'co_conscious': return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
      case 'passive': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-[#273F4F]/5 text-[#273F4F] border-[#273F4F]/10';
    }
  };

  // Sort logs chronologically (oldest to newest) for continuous flow calculations
  const chronologicalLogs = useMemo(() => {
    return [...switchLogs].sort((a, b) => a.timestamp - b.timestamp);
  }, [switchLogs]);

  // --- 1. COMPUTATION FOR CONTINUOUS TIMELINE RIBBON ---
  const timelineSegments = useMemo(() => {
    if (chronologicalLogs.length === 0) return [];

    const now = Date.now();
    let rangeMs = 24 * 60 * 60 * 1000; // default 24h
    if (timelineRange === '3d') rangeMs = 3 * 24 * 60 * 60 * 1000;
    if (timelineRange === '7d') rangeMs = 7 * 24 * 60 * 60 * 1000;

    const thresholdTime = now - rangeMs;
    
    // Find all intervals that overlap with the range.
    // If the oldest switch log is inside the range, we pretend they fronted from the start of the range as "Previous state"
    // or just show the actual registered switches.
    const intervals: Array<{
      id: string;
      alterIds: string[];
      startTime: number;
      endTime: number;
      durationMs: number;
      notes?: string;
      status?: string;
    }> = [];

    for (let i = 0; i < chronologicalLogs.length; i++) {
      const log = chronologicalLogs[i];
      const nextLog = chronologicalLogs[i + 1];
      const logStart = log.timestamp;
      const logEnd = nextLog ? nextLog.timestamp : now;

      // Check if this interval falls within or overlaps our range
      if (logEnd > thresholdTime) {
        // Clamp start to the threshold time to keep display neat
        const displayStart = Math.max(logStart, thresholdTime);
        const displayEnd = logEnd;
        const durationMs = displayEnd - displayStart;

        if (durationMs > 0) {
          intervals.push({
            id: log.id,
            alterIds: log.alterIds,
            startTime: displayStart,
            endTime: displayEnd,
            durationMs,
            notes: log.notes,
            status: log.status
          });
        }
      }
    }

    return intervals;
  }, [chronologicalLogs, timelineRange]);

  // --- 2. COMPUTATION FOR WEEKLY SWITCH FREQUENCY GRAPH ---
  const weeklyFrequencyData = useMemo(() => {
    const dataPoints: Array<{
      date: Date;
      label: string;
      count: number;
      logs: SwitchLog[];
    }> = [];

    const todayObj = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(todayObj.getDate() - i);
      
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0).getTime();
      const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999).getTime();
      
      const logsOnThisDay = switchLogs.filter(log => log.timestamp >= startOfDay && log.timestamp <= endOfDay);
      
      dataPoints.push({
        date: targetDate,
        label: `${formatWeekdayShort(targetDate)} ${targetDate.getDate()}`,
        count: logsOnThisDay.length,
        logs: logsOnThisDay
      });
    }

    return dataPoints;
  }, [switchLogs, lang]);

  // Max value for scaling SVG line graph
  const maxSwitchCount = useMemo(() => {
    const maxVal = Math.max(...weeklyFrequencyData.map(d => d.count));
    return maxVal < 4 ? 4 : maxVal; // Ensure at least scale of 4 for elegant proportions
  }, [weeklyFrequencyData]);

  // --- 3. COMPUTATION FOR ALTER PRESENCE RATIO (SHARE) ---
  const alterPresenceStats = useMemo(() => {
    const totals: Record<string, { count: number, totalDurationMs: number }> = {};
    const now = Date.now();
    let totalLogsCount = chronologicalLogs.length;

    // Default counting triggers
    savedAlters.forEach(a => {
      totals[a.id] = { count: 0, totalDurationMs: 0 };
    });

    for (let i = 0; i < chronologicalLogs.length; i++) {
      const log = chronologicalLogs[i];
      const nextLog = chronologicalLogs[i + 1];
      const durationMs = (nextLog ? nextLog.timestamp : now) - log.timestamp;

      log.alterIds.forEach(id => {
        if (!totals[id]) {
          totals[id] = { count: 0, totalDurationMs: 0 };
        }
        totals[id].count += 1;
        totals[id].totalDurationMs += durationMs;
      });
    }

    const compiled = Object.entries(totals).map(([alterId, data]) => {
      const alterObj = savedAlters.find(a => a.id === alterId);
      return {
        alterId,
        name: alterObj?.alterName || 'Anonymous',
        count: data.count,
        durationMs: data.totalDurationMs,
        durationHours: parseFloat((data.totalDurationMs / (1000 * 60 * 60)).toFixed(1)),
        avatar: alterObj?.profileImage || ''
      };
    });

    return compiled.sort((a, b) => b.durationMs - a.durationMs || b.count - a.count);
  }, [chronologicalLogs, savedAlters]);

  // Total recorded front duration in timeline for ratios
  const totalDurationSum = useMemo(() => {
    return alterPresenceStats.reduce((acc, stat) => acc + stat.durationMs, 0) || 1;
  }, [alterPresenceStats]);

  // SVG dimensions for frequency chart
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const getCoordinates = (index: number, count: number) => {
    const segmentWidth = (svgWidth - paddingX * 2) / 6;
    const x = paddingX + index * segmentWidth;
    
    const usableHeight = svgHeight - paddingY * 2;
    const y = svgHeight - paddingY - (count / maxSwitchCount) * usableHeight;
    return { x, y };
  };

  const linePath = useMemo(() => {
    if (weeklyFrequencyData.length === 0) return '';
    return weeklyFrequencyData.map((d, i) => {
      const { x, y } = getCoordinates(i, d.count);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [weeklyFrequencyData, maxSwitchCount]);

  const fillAreaPath = useMemo(() => {
    if (weeklyFrequencyData.length === 0) return '';
    const points = weeklyFrequencyData.map((d, i) => {
      const { x, y } = getCoordinates(i, d.count);
      return `${x} ${y}`;
    });
    const { x: startX } = getCoordinates(0, 0);
    const { x: endX } = getCoordinates(6, 0);
    const bottomY = svgHeight - paddingY;
    
    return `M ${startX} ${bottomY} L ${points.join(' L ')} L ${endX} ${bottomY} Z`;
  }, [weeklyFrequencyData, maxSwitchCount]);

  return (
    <div className="bg-app-card border border-app-border/30 rounded-2xl p-6 shadow-sm space-y-6 text-[#273F4F]">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#273F4F]" />
            <span>{lang === 'fr' ? 'Analyse Continue & Diagrammes' : 'Continuous Analysis & Charts'}</span>
          </h3>
          <p className="text-[10px] text-[#273F4F]/75 uppercase tracking-widest font-black font-mono mt-0.5">
            {lang === 'fr' ? 'Visualisation temporelle et fréquences du système' : 'Temporal system visualization & frequencies'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-app-bg/60 p-1 rounded-xl border border-app-border/20 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer select-none border border-transparent ${
              activeTab === 'timeline'
                ? 'bg-white text-[#273F4F] shadow-sm font-black'
                : 'text-[#273F4F]/70 hover:text-[#273F4F]'
            }`}
          >
            {lang === 'fr' ? 'Chronologie (Ribbon)' : 'Timeline'}
          </button>
          <button
            onClick={() => setActiveTab('frequency')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer select-none border border-transparent ${
              activeTab === 'frequency'
                ? 'bg-white text-[#273F4F] shadow-sm font-black'
                : 'text-[#273F4F]/70 hover:text-[#273F4F]'
            }`}
          >
            {lang === 'fr' ? 'Fréquence (7j)' : 'Frequency (7d)'}
          </button>
          <button
            onClick={() => setActiveTab('ratio')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer select-none border border-transparent ${
              activeTab === 'ratio'
                ? 'bg-white text-[#273F4F] shadow-sm font-black'
                : 'text-[#273F4F]/70 hover:text-[#273F4F]'
            }`}
          >
            {lang === 'fr' ? 'Parts de front' : 'Front Share'}
          </button>
        </div>
      </div>

      {switchLogs.length === 0 ? (
        <div className="text-center py-10 bg-app-bg/30 rounded-xl border border-dashed border-app-border/40 text-app-muted text-xs flex flex-col items-center justify-center space-y-2">
          <Clock className="w-8 h-8 opacity-45 text-[#273F4F]" />
          <p className="font-semibold text-app-text/80">{lang === 'fr' ? 'Enregistrez votre premier switch pour générer le diagramme !' : 'Log your first switch to generate analytical diagrams!'}</p>
          <p className="text-[10px] uppercase font-bold text-[#273F4F]/50">{lang === 'fr' ? 'Données locales en temps réel' : 'Real-time offline database tracking'}</p>
        </div>
      ) : (
        <div className="bg-app-bg/30 p-5 rounded-2xl border border-app-border/10">
          
          {/* TAB 1: CONTINUOUS TIMELINE (RIBBON) */}
          <AnimatePresence mode="wait">
            {activeTab === 'timeline' && (
              <motion.div
                key="timeline-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                {/* Duration Filter option */}
                <div className="flex justify-between items-center bg-app-card/35 px-4 py-2.5 rounded-xl border border-app-border/15">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#273F4F]/80 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#273F4F]" />
                    {lang === 'fr' ? 'Échelle temporelle :' : 'Scale range :'}
                  </span>
                  <div className="flex gap-1">
                    {(['24h', '3d', '7d'] as FilterRange[]).map(r => (
                      <button
                        key={r}
                        onClick={() => setTimelineRange(r)}
                        className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer ${
                          timelineRange === r
                            ? 'bg-[#273F4F] text-white'
                            : 'bg-app-card hover:bg-app-bg text-[#273F4F]/70 border border-app-border/15'
                        }`}
                      >
                        {r === '24h' && (lang === 'fr' ? 'Dernières 24h' : 'Last 24h')}
                        {r === '3d' && (lang === 'fr' ? '3 jours' : '3 days')}
                        {r === '7d' && (lang === 'fr' ? '7 jours' : '7 days')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Visual Ribbon representation */}
                {timelineSegments.length === 0 ? (
                  <div className="text-center py-8 text-xs font-semibold text-app-muted">
                    {lang === 'fr' ? 'Aucun log dans la plage sélectionnée.' : 'No switch logs found in selected duration range.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-app-muted flex justify-between px-1">
                      <span>{lang === 'fr' ? 'Gauche : Plus ancien' : 'Left: Older'}</span>
                      <span className="flex items-center gap-1">
                        {lang === 'fr' ? 'Aujourd\'hui (Maintenant) ' : 'Present / Now '}
                        <ArrowRight className="w-3 h-3 text-[#273F4F]" />
                      </span>
                    </div>

                    {/* The ribbon row container */}
                    <div className="h-10 w-full flex bg-app-card border border-app-border/30 rounded-xl overflow-hidden shadow-inner cursor-pointer select-none">
                      {(() => {
                        const totalRangeMs = timelineRange === '24h' ? 24 * 60 * 60 * 1000 : timelineRange === '3d' ? 3 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
                        
                        return timelineSegments.map((segment, idx) => {
                          const widthPct = Math.max(2, (segment.durationMs / totalRangeMs) * 100);
                          const formattedDuration = segment.durationMs > 1000 * 60 * 60 
                            ? `${(segment.durationMs / (1000 * 60 * 60)).toFixed(1)}h`
                            : segment.durationMs > 1000 * 60
                            ? `${Math.floor(segment.durationMs / (1000 * 60))}m`
                            : `${Math.floor(segment.durationMs / 1000)}s`;

                          // Cycle backgrounds with beautiful soft theme tones
                          const segmentColors = [
                            'bg-[#273F4F]/10 hover:bg-[#273F4F]/15 border-l border-app-border/25',
                            'bg-[#273F4F]/25 hover:bg-[#273F4F]/30 border-l border-app-border/25',
                            'bg-app-accent/20 hover:bg-app-accent/25 border-l border-white/20',
                            'bg-[#EADED4]/40 hover:bg-[#EADED4]/50 border-l border-app-border/25',
                          ];
                          const visualBg = segmentColors[idx % segmentColors.length];
                          
                          // Resolve alters names or status
                          const alterNames = segment.alterIds.map(id => savedAlters.find(a => a.id === id)?.alterName || 'Anonymous').join(' + ');

                          return (
                            <div
                              key={segment.id}
                              style={{ width: `${widthPct}%` }}
                              className={`${visualBg} h-full transition-all flex flex-col justify-center items-center px-1 overflow-hidden group relative`}
                              title={`${alterNames} (${formattedDuration})`}
                            >
                              <span className="text-[8px] font-black uppercase text-[#273F4F] truncate tracking-normal font-mono max-w-full block leading-none">
                                {alterNames.split(' + ')[0]}
                              </span>
                              
                              {/* Hover bubble helper */}
                              <div className="absolute bottom-full mb-2 bg-[#273F4F] text-white p-2.5 rounded-lg text-[9px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md border border-[#273F4F]/20 w-44 font-sans leading-relaxed">
                                <p className="font-extrabold uppercase tracking-wide border-b border-white/10 pb-1 mb-1 font-mono text-[8px] text-[#EADED4]">
                                  {formatDateShort(segment.startTime)} @ {formatTime(segment.startTime)}
                                </p>
                                <p className="font-black text-xs leading-tight line-clamp-2 text-white">{alterNames}</p>
                                <p className="mt-1 text-white/80 font-semibold">{lang === 'fr' ? 'Durée :' : 'Duration :'} <strong>{formattedDuration}</strong></p>
                                {segment.status && segment.status !== 'none' && (
                                  <span className="mt-1 inline-block px-1 rounded bg-white/20 text-white font-black uppercase text-[7px]" style={{ fontSize: '7px' }}>
                                    {getStatusLabel(segment.status)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Summary listing inside timeline for clarity */}
                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-2">
                      <h4 className="text-[9px] font-black uppercase tracking-wider text-[#273F4F]/80 pb-1 border-b border-app-border/10">
                        {lang === 'fr' ? 'Chronologie détaillée (Récents)' : 'Detailed ribbon list (Recent)'}
                      </h4>
                      {[...timelineSegments].reverse().map(segment => {
                        const durationHrs = Math.round(segment.durationMs / (1000 * 60)) / 60;
                        const roundedMinutes = Math.round(segment.durationMs / (1000 * 60));
                        const alterNames = segment.alterIds.map(id => savedAlters.find(a => a.id === id)?.alterName || 'Anonymous').join(' + ');
                        
                        return (
                          <div key={segment.id} className="flex justify-between items-center text-xs p-2.5 bg-app-card/45 hover:bg-app-card/75 border border-app-border/15 rounded-xl transition-all font-mono">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <Clock className="w-3.5 h-3.5 text-[#273F4F] shrink-0" />
                              <div className="truncate">
                                <span className="font-black text-app-text truncate inline-block mr-2">{alterNames}</span>
                                {segment.status && segment.status !== 'none' && (
                                  <span className={`px-1 rounded text-[7px] font-black uppercase inline-block border align-middle leading-tight ${getStatusColorClass(segment.status)}`}>
                                    {getStatusLabel(segment.status)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0 flex items-center gap-3 text-[10px]">
                              <span className="text-app-muted">
                                {formatDateShort(segment.startTime)} @ {formatTime(segment.startTime)}
                              </span>
                              <span className="font-bold text-[#273F4F] bg-[#273F4F]/5 py-0.5 px-2 rounded font-sans leading-none text-[9px] uppercase tracking-wide border border-[#273F4F]/10">
                                {roundedMinutes >= 60 
                                  ? `${durationHrs.toFixed(1)}h`
                                  : `${roundedMinutes}m`
                                }
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: WEEKLY FREQUENCY GRAPH */}
            {activeTab === 'frequency' && (
              <motion.div
                key="frequency-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-xs text-[#273F4F]/90 font-black uppercase tracking-wider mb-2">
                    {lang === 'fr' ? 'Nombre de switchs quotidiens sur les 7 derniers jours' : 'Frequency chart of switches over the past 7 days'}
                  </p>
                </div>

                {/* SVG Area Line Chart */}
                <div className="relative w-full overflow-x-auto select-none">
                  <svg 
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                    className="w-full h-auto max-h-[220px] mx-auto overflow-visible"
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#273F4F" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#273F4F" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis dashed guidelines */}
                    {[0, 1, 2, 3, 4].map((step) => {
                      const value = Math.round((step / 4) * maxSwitchCount);
                      const usableHeight = svgHeight - paddingY * 2;
                      const y = svgHeight - paddingY - (step / 4) * usableHeight;
                      
                      return (
                        <g key={step} className="opacity-40">
                          <line 
                            x1={paddingX} 
                            y1={y} 
                            x2={svgWidth - paddingX} 
                            y2={y} 
                            stroke="#273F4F" 
                            strokeWidth="1" 
                            strokeDasharray="4 4" 
                          />
                          <text 
                            x={paddingX - 10} 
                            y={y + 4} 
                            textAnchor="end" 
                            className="fill-[#273F4F] font-mono text-[9px] font-black"
                          >
                            {value}
                          </text>
                        </g>
                      );
                    })}

                    {/* Shaded Area underneath curve */}
                    {linePath && (
                      <path 
                        d={fillAreaPath} 
                        fill="url(#areaGradient)" 
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Outline curve line */}
                    {linePath && (
                      <path 
                        d={linePath} 
                        fill="none" 
                        stroke="#273F4F" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeLinejoin="round" 
                        className="transition-all duration-300 opacity-90"
                      />
                    )}

                    {/* Dots and Labels */}
                    {weeklyFrequencyData.map((d, idx) => {
                      const { x, y } = getCoordinates(idx, d.count);
                      
                      return (
                        <g key={idx} className="group/dot cursor-pointer">
                          {/* Invisible larger circle to make hover easier */}
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="12" 
                            fill="transparent"
                            onClick={() => {
                              setSelectedDayIndex(selectedDayIndex === idx ? null : idx);
                            }}
                            onMouseEnter={() => setActiveTooltipIndex(idx)}
                            onMouseLeave={() => setActiveTooltipIndex(null)}
                          />
                          
                          {/* Visible core dot */}
                          <circle 
                            cx={x} 
                            cy={y} 
                            r={selectedDayIndex === idx ? "7" : "5"} 
                            fill={selectedDayIndex === idx ? "#ffffff" : "#273F4F"} 
                            stroke="#273F4F"
                            strokeWidth="3"
                            className="transition-all duration-200"
                          />

                          {/* Value label directly on hover */}
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            className={`fill-[#273F4F] font-black font-sans text-[10px] pointer-events-none transition-opacity ${
                              activeTooltipIndex === idx || selectedDayIndex === idx ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            {d.count} {lang === 'fr' ? 'sw.' : 'sw.'}
                          </text>

                          {/* Day label on X Axis */}
                          <text 
                            x={x} 
                            y={svgHeight - 10} 
                            textAnchor="middle" 
                            className={`fill-[#273F4F] font-mono text-[9px] font-black ${
                              selectedDayIndex === idx ? 'underline opacity-100 font-bold' : 'opacity-70'
                            }`}
                          >
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Day Selector Information Panel */}
                <div className="bg-app-card/40 p-4 rounded-xl border border-app-border/15">
                  {selectedDayIndex !== null ? (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center border-b border-app-border/10 pb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#273F4F]/80 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {weeklyFrequencyData[selectedDayIndex].label}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-white text-[#273F4F] px-2.5 py-1 rounded-md border border-app-border/20">
                          {weeklyFrequencyData[selectedDayIndex].count} {weeklyFrequencyData[selectedDayIndex].count > 1 ? (lang === 'fr' ? 'switchs enregistrés' : 'switches recorded') : (lang === 'fr' ? 'switch enregistré' : 'switch recorded')}
                        </span>
                      </div>

                      {weeklyFrequencyData[selectedDayIndex].logs.length === 0 ? (
                        <p className="text-xs text-app-muted italic text-center py-2">
                          {lang === 'fr' ? 'Aucun switch enregistré sur cette journée.' : 'No switch logs found for this day.'}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {weeklyFrequencyData[selectedDayIndex].logs.map(log => {
                            const names = log.alterIds.map(id => savedAlters.find(a => a.id === id)?.alterName || 'Anonymous').join(' + ');
                            return (
                              <div key={log.id} className="flex justify-between items-center text-xs p-2 bg-app-card/60 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#273F4F]" />
                                  <span className="font-bold text-app-text">{names}</span>
                                </div>
                                <span className="font-mono text-[10px] text-app-muted">
                                  {formatTime(log.timestamp)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-app-muted text-center py-1.5 italic">
                      {lang === 'fr' ? '💡 Cliquez sur les points du graphique pour inspecter les switchs d\'une journée.' : '💡 Click on any point in the chart to inspect switches on that specific day.'}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: ALTER PRESENCE STATS */}
            {activeTab === 'ratio' && (
              <motion.div
                key="ratio-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-xs text-[#273F4F]/90 font-black uppercase tracking-wider">
                    {lang === 'fr' ? 'Temps ou taux d\'occupation estimé par alter (Durée relative)' : 'Estimated active fronting share per alter (Relative duration)'}
                  </p>
                </div>

                <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-2">
                  {alterPresenceStats.length === 0 ? (
                    <div className="text-center py-8 text-xs text-app-muted">
                      {lang === 'fr' ? 'Données insuffisantes.' : 'Not enough data.'}
                    </div>
                  ) : (
                    alterPresenceStats.map((stat, idx) => {
                      const sharePct = Math.round((stat.durationMs / totalDurationSum) * 100) || 0;
                      
                      return (
                        <div key={stat.alterId} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              {/* Small color ring or indicator */}
                              <span className="w-2.5 h-2.5 rounded-full bg-[#273F4F]/50 border border-[#273F4F]/10 shrink-0" />
                              <strong className="text-app-text">{stat.name}</strong>
                            </div>
                            
                            <div className="flex items-center gap-3 font-mono text-[10px]">
                              <span className="text-app-muted">
                                {stat.count} {stat.count > 1 ? 'switchs' : 'switch'}
                              </span>
                              <span className="text-[#273F4F]/80 font-bold bg-[#273F4F]/5 py-0.5 px-2 rounded">
                                {stat.durationHours > 0 
                                  ? `${stat.durationHours}h (${sharePct}%)`
                                  : `${Math.round(stat.durationMs / (1000 * 60))}m (${sharePct}%)`
                                }
                              </span>
                            </div>
                          </div>
                          
                          {/* Colored Progress bar */}
                          <div className="w-full h-2.5 bg-app-card rounded-full overflow-hidden border border-app-border/20">
                            <motion.div 
                              className="h-full bg-[#273F4F] opacity-90 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${sharePct}%` }}
                              transition={{ duration: 0.4, delay: idx * 0.05 }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      )}

    </div>
  );
}
