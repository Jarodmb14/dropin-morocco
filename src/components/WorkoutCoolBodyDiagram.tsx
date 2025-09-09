import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Import the body images
import bodyFrontImage from '@/assets/body-front.png';
import bodyBackImage from '@/assets/body-back.png';

// Muscle groups enum matching workout-cool
export enum MuscleGroup {
  CHEST = 'CHEST',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  SHOULDERS = 'SHOULDERS',
  BACK = 'BACK',
  ABDOMINALS = 'ABDOMINALS',
  OBLIQUES = 'OBLIQUES',
  FOREARMS = 'FOREARMS',
  QUADRICEPS = 'QUADRICEPS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  TRAPS = 'TRAPS',
}

interface WorkoutCoolBodyDiagramProps {
  selectedMuscles?: MuscleGroup[];
  onMuscleToggle?: (muscle: MuscleGroup) => void;
  variant?: 'front' | 'back';
  debugMode?: boolean;
}

export const WorkoutCoolBodyDiagram: React.FC<WorkoutCoolBodyDiagramProps> = ({
  selectedMuscles = [],
  onMuscleToggle,
  variant = 'front',
  debugMode = false,
}) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroup | null>(null);

  const getMuscleClasses = (muscle: MuscleGroup) => {
    const isSelected = selectedMuscles.includes(muscle);
    const isHovered = hoveredMuscle === muscle;
    
    return cn(
      "transition-all duration-100 ease-out",
      isSelected ? "fill-blue-500" : "fill-slate-400",
      isHovered && !isSelected ? "fill-blue-400" : "",
    );
  };

  const handleMuscleClick = (muscle: MuscleGroup) => {
    onMuscleToggle?.(muscle);
  };

  const handleMuscleHover = (muscle: MuscleGroup | null) => {
    setHoveredMuscle(muscle);
  };

  const isSelected = (muscle: MuscleGroup) => selectedMuscles.includes(muscle);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background Image */}
      <div className="relative">
        <img
          src={variant === 'front' ? bodyFrontImage : bodyBackImage}
          alt={`Human body ${variant} view`}
          className="w-full h-auto"
        />
        
        {/* SVG Overlay for Muscle Selection */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 535 462"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Chest Group */}
          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.CHEST)}>
            {/* Transparent clickable area */}
            <path
              className="fill-transparent"
              d="M 72.50,111.50
                 C 72.50,111.50 77.50,102.50 77.50,102.25
                   77.50,102.00 81.75,94.00 81.75,94.00
                   81.75,94.00 84.50,87.50 84.50,87.50
                   84.50,87.50 85.50,85.50 85.50,85.50
                   85.50,85.50 88.75,83.25 88.75,83.25
                   88.75,83.25 95.50,83.50 95.50,83.50
                   95.50,83.50 99.75,84.25 99.75,84.25
                   99.75,84.25 104.25,86.00 104.25,86.00
                   104.25,86.00 113.00,86.75 113.00,86.75
                   113.00,86.75 120.50,86.75 120.50,86.75
                   120.50,86.75 126.75,86.00 126.75,86.00
                   126.75,86.00 133.50,83.75 133.50,83.75
                   133.50,83.75 138.00,83.50 138.00,83.50
                   138.00,83.50 141.50,83.75 141.50,83.75
                   141.50,83.75 143.75,86.25 143.75,86.25
                   143.75,86.25 149.00,96.00 149.00,96.00
                   149.00,96.00 154.25,106.00 154.25,106.00
                   154.25,106.00 156.00,110.50 156.00,110.50
                   156.00,110.50 155.00,115.00 155.00,115.00
                   155.00,115.00 149.75,118.00 149.75,118.00M 136.75,123.50
                 C 136.75,123.50 132.50,124.25 132.50,124.25
                   132.50,124.25 127.75,123.75 127.75,123.75
                   127.75,123.75 119.75,120.25 119.75,120.25
                   119.75,120.25 115.00,127.75 115.00,127.75
                   115.00,127.75 109.25,120.50 109.25,120.50
                   109.25,120.50 103.00,124.00 103.00,124.00
                   103.00,124.00 98.50,124.75 98.50,124.75
                   98.50,124.75 91.75,123.25 91.75,123.25
                   91.75,123.25 80.00,118.00 80.00,118.00
                   80.00,118.00 73.00,111.75 73.00,111.75"
              data-elem={MuscleGroup.CHEST}
              stroke="black"
              strokeWidth="0"
            />
            
            {/* Visible muscle paths */}
            <path
              className={getMuscleClasses(MuscleGroup.CHEST)}
              d="M 128.00,122.83
                 C 132.18,123.49 136.25,123.15 140.14,121.62
                   145.31,119.58 149.70,116.28 153.73,112.49
                   154.47,111.79 154.70,110.91 154.40,109.98
                   153.95,108.57 153.53,107.12 152.81,105.84
                   149.78,100.45 146.82,95.05 144.62,89.25
                   143.53,86.37 139.34,82.87 136.11,83.86
                   131.78,85.18 127.51,86.71 123.26,88.29
                   119.12,89.83 116.94,93.03 116.62,97.33
                   116.32,101.36 116.14,105.41 116.31,109.44
                   116.56,115.50 121.62,121.81 128.00,122.83"
              data-elem={MuscleGroup.CHEST}
              stroke="black"
              strokeWidth="0"
            />
            
            <path
              className={getMuscleClasses(MuscleGroup.CHEST)}
              d="M 115.70,124.93
                 C 116.59,123.70 117.47,122.46 118.32,121.20
                   118.61,120.76 118.81,120.26 119.06,119.77
                   118.96,119.45 118.93,119.13 118.77,118.89
                   117.79,117.39 116.84,115.87 115.76,114.45
                   114.99,113.43 114.47,113.43 113.69,114.49
                   112.62,115.92 111.67,117.44 110.74,118.97
                   110.55,119.30 110.53,119.94 110.72,120.25
                   111.72,121.86 112.79,123.44 113.91,124.98
                   114.45,125.72 115.15,125.69 115.70,124.93"
              data-elem={MuscleGroup.CHEST}
              stroke="black"
              strokeWidth="0"
            />
            
            <path
              className={getMuscleClasses(MuscleGroup.CHEST)}
              d="M 112.42,97.33
                 C 112.10,93.03 109.92,89.83 105.78,88.29
                   101.53,86.71 97.26,85.18 92.93,83.86
                   89.70,82.87 85.51,86.37 84.42,89.25
                   82.22,95.05 79.26,100.45 76.23,105.84
                   75.51,107.12 75.09,108.57 74.64,109.98
                   74.34,110.91 74.57,111.79 75.31,112.49
                   79.34,116.28 83.73,119.58 88.90,121.62
                   92.79,123.15 96.86,123.49 101.04,122.83
                   107.42,121.81 112.48,115.50 112.73,109.44
                   112.90,105.41 112.72,101.36 112.42,97.33"
              data-elem={MuscleGroup.CHEST}
              stroke="black"
              strokeWidth="0"
            />
          </g>

          {/* Biceps Group */}
          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.BICEPS)}>
            {/* Transparent clickable area */}
            <path
              className="fill-transparent"
              d="M 49.25,117.25
                 C 49.25,117.25 45.50,120.75 45.50,120.75
                   45.50,120.75 42.00,129.00 42.00,129.00
                   42.00,129.00 41.25,137.75 41.25,137.75
                   41.25,137.75 42.00,145.25 42.00,145.25
                   42.00,145.25 46.50,149.50 46.50,149.50
                   46.50,149.50 48.25,153.25 48.25,153.25
                   48.25,153.25 49.25,166.50 49.25,166.50
                   49.25,166.50 60.25,153.00 60.25,153.00
                   60.25,153.00 61.25,149.50 61.25,149.50
                   61.25,149.50 63.75,151.50 63.75,151.50
                   63.75,151.50 68.00,148.75 68.00,148.75
                   68.00,148.75 73.00,140.50 73.00,140.50
                   73.00,140.50 74.25,129.50 74.25,129.50
                   74.25,129.50 74.50,120.25 74.50,120.25
                   74.50,120.25 74.50,116.50 74.50,116.50
                   74.50,116.50 73.00,113.00 73.00,113.00
                   73.00,113.00 71.25,111.50 71.25,111.50
                   71.25,111.50 68.00,110.50 68.00,110.50
                   68.00,110.50 57.75,114.25 57.75,114.25
                   57.75,114.25 49.50,117.50 49.50,117.50"
              data-elem={MuscleGroup.BICEPS}
              stroke="black"
              strokeWidth="0"
            />
            
            {/* Visible muscle paths */}
            <path
              className={getMuscleClasses(MuscleGroup.BICEPS)}
              d="M 166.82,151.36
                 C 166.99,151.37 166.72,150.23 166.86,150.14
                   166.46,148.57 166.10,146.98 165.67,145.42
                   164.18,140.02 162.71,134.62 161.15,129.24
                   160.79,128.01 158.77,117.31 158.25,114.97
                   158.05,114.59 157.47,118.80 157.14,121.79
                   157.09,122.29 157.16,124.59 157.08,125.04
                   156.95,125.74 157.27,130.26 157.40,130.96
                   158.57,137.01 159.49,139.00 162.34,144.99
                   162.91,146.19 164.64,148.86 165.33,149.99
                   165.62,150.47 166.25,151.31 166.82,151.36"
              data-elem={MuscleGroup.BICEPS}
              stroke="black"
              strokeWidth="0"
            />
            
            <path
              className={getMuscleClasses(MuscleGroup.BICEPS)}
              d="M 160.10,114.96
                 C 160.64,121.59 161.87,128.11 163.78,134.48
                   164.74,137.69 165.80,140.87 166.86,144.05
                   168.73,149.65 171.29,154.88 174.82,159.66
                   176.46,161.88 177.68,164.42 179.09,166.81
                   179.16,166.93 179.26,167.02 179.52,167.32
                   179.64,166.25 179.80,165.40 179.82,164.55
                   179.94,159.48 179.56,151.75 182.68,147.85
                   184.94,145.02 185.76,140.37 185.60,137.71
                   185.30,132.58 184.87,130.15 182.68,125.43
                   177.61,114.52 170.89,114.39 163.98,111.93
                   161.46,111.02 159.88,112.29 160.10,114.96"
              data-elem={MuscleGroup.BICEPS}
              stroke="black"
              strokeWidth="0"
            />
            
            <path
              className={getMuscleClasses(MuscleGroup.BICEPS)}
              d="M 62.71,151.36
                 C 63.28,151.31 63.91,150.47 64.20,149.99
                   64.90,148.86 66.62,146.19 67.19,144.99
                   70.04,139.00 70.97,137.01 72.13,130.96
                   72.27,130.26 72.59,125.74 72.46,125.04
                   72.37,124.59 72.45,122.29 72.39,121.79
                   72.07,118.80 71.48,114.59 71.29,114.97
                   70.77,117.31 68.74,128.01 68.38,129.24
                   66.83,134.62 65.35,140.02 63.86,145.42
                   63.43,146.98 63.07,148.57 62.68,150.14
                   62.81,150.23 62.54,151.37 62.71,151.36"
              data-elem={MuscleGroup.BICEPS}
              stroke="black"
              strokeWidth="0"
            />
            
            <path
              className={getMuscleClasses(MuscleGroup.BICEPS)}
              d="M 49.72,164.55
                 C 49.74,165.40 49.90,166.25 50.02,167.32
                   50.27,167.02 50.37,166.93 50.44,166.81
                   51.85,164.42 53.07,161.88 54.71,159.66
                   58.24,154.88 60.81,149.65 62.67,144.05
                   63.73,140.87 64.79,137.69 65.76,134.48
                   67.67,128.11 68.90,121.59 69.44,114.96
                   69.66,112.29 68.07,111.02 65.55,111.93
                   58.64,114.39 51.92,114.52 46.86,125.43
                   44.67,130.15 44.23,132.58 43.93,137.71
                   43.78,140.37 44.59,145.02 46.86,147.85
                   49.98,151.75 49.59,159.48 49.72,164.55"
              data-elem={MuscleGroup.BICEPS}
              stroke="black"
              strokeWidth="0"
            />
          </g>

          {/* Add more muscle groups here following the same pattern */}
          {/* For now, I'll add a few more key muscle groups */}
          
          {/* Shoulders Group */}
          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.SHOULDERS)}>
            <path
              className="fill-transparent"
              d="M 50,80 C 50,80 60,70 70,75 C 80,80 90,85 100,80 C 110,75 120,70 130,75 C 140,80 150,85 160,80 C 170,75 180,70 190,75 C 200,80 210,85 220,80 C 230,75 240,70 250,75 C 260,80 270,85 280,80 C 290,75 300,70 310,75 C 320,80 330,85 340,80 C 350,75 360,70 370,75 C 380,80 390,85 400,80 C 410,75 420,70 430,75 C 440,80 450,85 460,80 C 470,75 480,70 490,75 C 500,80 510,85 520,80"
              data-elem={MuscleGroup.SHOULDERS}
              stroke="black"
              strokeWidth="0"
            />
            <path
              className={getMuscleClasses(MuscleGroup.SHOULDERS)}
              d="M 100,80 C 110,75 120,70 130,75 C 140,80 150,85 160,80 C 170,75 180,70 190,75 C 200,80 210,85 220,80"
              data-elem={MuscleGroup.SHOULDERS}
              stroke="black"
              strokeWidth="0"
            />
          </g>

          {/* Abdominals Group */}
          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.ABDOMINALS)}>
            <path
              className="fill-transparent"
              d="M 150,200 C 150,200 160,190 170,200 C 180,210 190,220 200,230 C 210,240 220,250 230,260 C 240,270 250,280 260,290 C 270,300 280,310 290,320 C 300,330 310,340 320,350 C 330,360 340,370 350,380 C 360,390 370,400 380,410 C 390,420 400,430 410,440 C 420,450 430,460 440,470 C 450,480 460,490 470,500"
              data-elem={MuscleGroup.ABDOMINALS}
              stroke="black"
              strokeWidth="0"
            />
            <path
              className={getMuscleClasses(MuscleGroup.ABDOMINALS)}
              d="M 200,230 C 210,240 220,250 230,260 C 240,270 250,280 260,290 C 270,300 280,310 290,320 C 300,330 310,340 320,350"
              data-elem={MuscleGroup.ABDOMINALS}
              stroke="black"
              strokeWidth="0"
            />
          </g>

          {/* Quadriceps Group */}
          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.QUADRICEPS)}>
            <path
              className="fill-transparent"
              d="M 200,350 C 200,350 210,360 220,370 C 230,380 240,390 250,400 C 260,410 270,420 280,430 C 290,440 300,450 310,460 C 320,470 330,480 340,490 C 350,500 360,510 370,520 C 380,530 390,540 400,550 C 410,560 420,570 430,580 C 440,590 450,600 460,610 C 470,620 480,630 490,640 C 500,650 510,660 520,670"
              data-elem={MuscleGroup.QUADRICEPS}
              stroke="black"
              strokeWidth="0"
            />
            <path
              className={getMuscleClasses(MuscleGroup.QUADRICEPS)}
              d="M 250,400 C 260,410 270,420 280,430 C 290,440 300,450 310,460 C 320,470 330,480 340,490 C 350,500 360,510 370,520"
              data-elem={MuscleGroup.QUADRICEPS}
              stroke="black"
              strokeWidth="0"
            />
          </g>

          {/* Debug mode - show clickable areas */}
          {debugMode && (
            <g>
              {/* Debug overlay for chest */}
              <path
                d="M 72.50,111.50
                   C 72.50,111.50 77.50,102.50 77.50,102.25
                     77.50,102.00 81.75,94.00 81.75,94.00
                     81.75,94.00 84.50,87.50 84.50,87.50
                     84.50,87.50 85.50,85.50 85.50,85.50
                     85.50,85.50 88.75,83.25 88.75,83.25
                     88.75,83.25 95.50,83.50 95.50,83.50
                     95.50,83.50 99.75,84.25 99.75,84.25
                     99.75,84.25 104.25,86.00 104.25,86.00
                     104.25,86.00 113.00,86.75 113.00,86.75
                     113.00,86.75 120.50,86.75 120.50,86.75
                     120.50,86.75 126.75,86.00 126.75,86.00
                     126.75,86.00 133.50,83.75 133.50,83.75
                     133.50,83.75 138.00,83.50 138.00,83.50
                     138.00,83.50 141.50,83.75 141.50,83.75
                     141.50,83.75 143.75,86.25 143.75,86.25
                     143.75,86.25 149.00,96.00 149.00,96.00
                     149.00,96.00 154.25,106.00 154.25,106.00
                     154.25,106.00 156.00,110.50 156.00,110.50
                     156.00,110.50 155.00,115.00 155.00,115.00
                     155.00,115.00 149.75,118.00 149.75,118.00M 136.75,123.50
                   C 136.75,123.50 132.50,124.25 132.50,124.25
                     132.50,124.25 127.75,123.75 127.75,123.75
                     127.75,123.75 119.75,120.25 119.75,120.25
                     119.75,120.25 115.00,127.75 115.00,127.75
                     115.00,127.75 109.25,120.50 109.25,120.50
                     109.25,120.50 103.00,124.00 103.00,124.00
                     103.00,124.00 98.50,124.75 98.50,124.75
                     98.50,124.75 91.75,123.25 91.75,123.25
                     91.75,123.25 80.00,118.00 80.00,118.00
                     80.00,118.00 73.00,111.75 73.00,111.75"
                fill="rgba(255, 0, 0, 0.3)"
                stroke="red"
                strokeWidth="2"
              />
              
              {/* Debug overlay for biceps */}
              <path
                d="M 49.25,117.25
                   C 49.25,117.25 45.50,120.75 45.50,120.75
                     45.50,120.75 42.00,129.00 42.00,129.00
                     42.00,129.00 41.25,137.75 41.25,137.75
                     41.25,137.75 42.00,145.25 42.00,145.25
                     42.00,145.25 46.50,149.50 46.50,149.50
                     46.50,149.50 48.25,153.25 48.25,153.25
                     48.25,153.25 49.25,166.50 49.25,166.50
                     49.25,166.50 60.25,153.00 60.25,153.00
                     60.25,153.00 61.25,149.50 61.25,149.50
                     61.25,149.50 63.75,151.50 63.75,151.50
                     63.75,151.50 68.00,148.75 68.00,148.75
                     68.00,148.75 73.00,140.50 73.00,140.50
                     73.00,140.50 74.25,129.50 74.25,129.50
                     74.25,129.50 74.50,120.25 74.50,120.25
                     74.50,120.25 74.50,116.50 74.50,116.50
                     74.50,116.50 73.00,113.00 73.00,113.00
                     73.00,113.00 71.25,111.50 71.25,111.50
                     71.25,111.50 68.00,110.50 68.00,110.50
                     68.00,110.50 57.75,114.25 57.75,114.25
                     57.75,114.25 49.50,117.50 49.50,117.50"
                fill="rgba(0, 255, 0, 0.3)"
                stroke="green"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>
      
      {/* Selected muscles display */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Selected: {selectedMuscles.length > 0 ? selectedMuscles.join(', ') : 'None'}
        </p>
      </div>
    </div>
  );
};

export default WorkoutCoolBodyDiagram;